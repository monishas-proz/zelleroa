import { ApiError } from "@/lib/api/api-error";
import { deliveryRepository } from "../repositories/delivery.repository";
import { userRepository } from "@/features/users/repositories/user.repository";
import {
  isDelhiveryConfigured,
  createDelhiveryShipment,
  trackDelhiveryShipment,
  getDelhiveryTrackingUrl,
} from "@/lib/shipping/delhivery-client";
import type {
  AdminDeliveryOrdersListInput,
  AdminDeliveryStaffListInput,
  AssignDeliveryInput,
  StaffDeliveryListInput,
  MarkDeliveredInput,
  MarkFailedInput,
  ShipViaCourierInput,
  RefreshCourierTrackingInput,
} from "../validations/delivery.schema";
import type {
  AdminDeliveryOrderItem,
  DeliveryStaffBasic,
  StaffDeliveryListItem,
  StaffDeliveryDetailResponse,
  AssignDeliveryResult,
  DeliveryTransitionResult,
  DeliveryAddressInfo,
  StaffDeliveriesCountResponse,
  CourierShipmentResult,
  RefreshCourierTrackingResult,
} from "../types/delivery.types";

/**
 * Very rough classification of Delhivery's free-text scan statuses into the
 * shipment/order lifecycle this app already tracks. Delhivery's actual status
 * vocabulary (Manifested, In Transit, Dispatched, Pending, RTO, etc.) should
 * be reconciled against this once live tracking responses are available.
 */
function classifyDelhiveryStatus(
  rawStatus: string
): "in_transit" | "out_for_delivery" | "delivered" | "failed" | null {
  const status = rawStatus.trim().toLowerCase();
  if (status.includes("deliver") && !status.includes("out for")) return "delivered";
  if (status.includes("out for delivery") || status.includes("dispatched")) {
    return "out_for_delivery";
  }
  if (status.includes("rto") || status.includes("undelivered") || status.includes("failed")) {
    return "failed";
  }
  if (status.includes("transit") || status.includes("manifested") || status.includes("pending")) {
    return "in_transit";
  }
  return null;
}

function formatShippingAddress(addresses: any[]): DeliveryAddressInfo | null {
  if (!addresses || addresses.length === 0) return null;
  const addr = addresses.find((a: any) => a.type === "shipping") || addresses[0];
  if (!addr) return null;
  return {
    fullName: addr.full_name,
    phone: addr.phone,
    addressLine1: addr.address_line1,
    addressLine2: addr.address_line2 ?? null,
    landmark: addr.landmark ?? null,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
  };
}

async function getAdminInternalId(email?: string | null): Promise<bigint | null> {
  if (!email) return null;
  const user = await userRepository.findByEmail(email);
  if (!user) return null;
  return BigInt(user.internalId || user.id);
}

export const deliveryService = {
  async getAdminDeliveryOrders(params: AdminDeliveryOrdersListInput) {
    const result = await deliveryRepository.findAdminDeliveryOrders(params);

    const data: AdminDeliveryOrderItem[] = result.orders.map((order) => {
      const latestShipment = order.shipments && order.shipments.length > 0 ? order.shipments[0] : null;

      return {
        id: order.uuid || String(order.id),
        orderNumber: order.orderNumber,
        orderStatus: order.order_status,
        paymentStatus: order.payment_status,
        totalAmount: Number(order.totalAmount),
        customer: {
          id: order.user.uuid || String(order.user.id),
          name: order.user.name,
          email: order.user.email,
          phone: order.user.phone,
        },
        deliverySlot: order.delivery_slots
          ? {
            id: order.delivery_slots.uuid || String(order.delivery_slots.id),
            slotDate: order.delivery_slots.slot_date
              ? order.delivery_slots.slot_date.toISOString().split("T")[0]
              : null,
            startTime: order.delivery_slots.start_time
              ? order.delivery_slots.start_time.toISOString().substring(11, 19)
              : null,
            endTime: order.delivery_slots.end_time
              ? order.delivery_slots.end_time.toISOString().substring(11, 19)
              : null,
          }
          : null,
        shippingAddress: formatShippingAddress(order.address),
        shipment: latestShipment
          ? {
            id: latestShipment.uuid || String(latestShipment.id),
            status: latestShipment.status,
            assignmentStatus: latestShipment.assignment_status || "pending",
            trackingNumber: latestShipment.tracking_number,
            deliveryNotes: latestShipment.delivery_notes,
            acceptedAt: latestShipment.accepted_at,
            shippedAt: latestShipment.shipped_at,
            deliveredAt: latestShipment.delivered_at,
            deliveryStaff: latestShipment.delivery_staff
              ? {
                id: latestShipment.delivery_staff.uuid || String(latestShipment.delivery_staff.id),
                name: latestShipment.delivery_staff.name,
                phone: latestShipment.delivery_staff.phone,
                avatar: latestShipment.delivery_staff.avatar ?? null,
              }
              : null,
            createdAt: latestShipment.created_at,
            updatedAt: latestShipment.updated_at,
          }
          : null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });

    return {
      data,
      meta: {
        page: result.page,
        limit: result.limit,
        pageSize: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 1,
      },
    };
  },

  async getAdminDeliveryStaff(params: AdminDeliveryStaffListInput) {
    const result = await deliveryRepository.findActiveDeliveryStaff(params);

    const data: DeliveryStaffBasic[] = result.staffList.map((s) => ({
      id: s.uuid || String(s.id),
      name: s.name,
      email: s.email || undefined,
      phone: s.phone,
      avatar: s.avatar ?? null,
      isActive: s.is_active,
    }));

    return {
      data,
      meta: {
        page: result.page,
        limit: result.limit,
        pageSize: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 1,
      },
    };
  },

  async assignDelivery(
    input: AssignDeliveryInput,
    adminEmail?: string | null
  ): Promise<AssignDeliveryResult> {
    const adminId = await getAdminInternalId(adminEmail);

    // 1. Look up Order
    const order = await deliveryRepository.findOrderByUuid(input.orderId);
    if (!order) {
      throw ApiError.notFound("Order not found");
    }

    // 2. Validate Order Status
    if (order.order_status !== "packed") {
      throw ApiError.badRequest(
        `Cannot assign delivery for order with status '${order.order_status}'. Order must be in 'packed' status.`
      );
    }

    // 3. Look up Staff
    const staff = await deliveryRepository.findStaffByUuid(input.staffId);
    if (!staff || staff.role?.slug !== "staff") {
      throw ApiError.notFound("Staff member not found or user is not a STAFF member");
    }

    // 4. Validate Staff Active Status
    if (!staff.is_active) {
      throw ApiError.badRequest("Cannot assign delivery to an inactive staff member");
    }

    // 5. Prevent duplicate active assignment
    const activeShipment = await deliveryRepository.findActiveShipmentByOrderId(order.id);
    if (activeShipment) {
      throw ApiError.conflict("Order already has an active delivery assignment");
    }

    // 6. Create Shipment Transaction
    const shipment = await deliveryRepository.createShipmentTransaction({
      orderId: order.id,
      staffId: staff.id,
      note: input.note,
      adminId,
    });

    return {
      id: shipment.uuid || String(shipment.id),
      orderId: order.uuid || String(order.id),
      status: shipment.status,
      assignmentStatus: shipment.assignment_status || "pending",
      deliveryStaff: {
        id: staff.uuid || String(staff.id),
        name: staff.name,
        phone: staff.phone,
      },
      createdAt: shipment.created_at,
    };
  },

  async getStaffDeliveries(
    sessionUserId: string,
    query: StaffDeliveryListInput
  ) {
    const staffUser = await userRepository.findById(sessionUserId);
    if (!staffUser || !staffUser.internalId) {
      throw ApiError.unauthorized("Staff member not found");
    }

    const result = await deliveryRepository.findStaffDeliveries(
      staffUser.internalId,
      query
    );

    const data: StaffDeliveryListItem[] = result.shipmentsList.map((s) => ({
      id: s.uuid || String(s.id),
      status: s.status,
      assignmentStatus: s.assignment_status || "pending",
      deliveryNotes: s.delivery_notes,
      acceptedAt: s.accepted_at,
      shippedAt: s.shipped_at,
      deliveredAt: s.delivered_at,
      order: {
        id: s.orders.uuid || String(s.orders.id),
        orderNumber: s.orders.orderNumber,
        orderStatus: s.orders.order_status,
        paymentStatus: s.orders.payment_status,
        totalAmount: Number(s.orders.totalAmount),
        notes: s.orders.notes,
        placedAt: s.orders.placed_at,
        createdAt: s.orders.createdAt,
      },
      customer: {
        id: s.orders.user.uuid || String(s.orders.user.id),
        name: s.orders.user.name,
        email: s.orders.user.email,
        phone: s.orders.user.phone,
      },
      shippingAddress: formatShippingAddress(s.orders.address),
      deliverySlot: s.orders.delivery_slots
        ? {
          id: s.orders.delivery_slots.uuid || String(s.orders.delivery_slots.id),
          slotDate: s.orders.delivery_slots.slot_date
            ? s.orders.delivery_slots.slot_date.toISOString().split("T")[0]
            : null,
          startTime: s.orders.delivery_slots.start_time
            ? s.orders.delivery_slots.start_time.toISOString().substring(11, 19)
            : null,
          endTime: s.orders.delivery_slots.end_time
            ? s.orders.delivery_slots.end_time.toISOString().substring(11, 19)
            : null,
        }
        : null,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    }));

    return {
      data,
      meta: {
        page: result.page,
        limit: result.limit,
        pageSize: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 1,
      },
    };
  },

  async countStaffDeliveries(
    sessionUserId: string,
    query: StaffDeliveryListInput
  ): Promise<StaffDeliveriesCountResponse> {
    const staffUser = await userRepository.findById(sessionUserId);
    if (!staffUser || !staffUser.internalId) {
      throw ApiError.unauthorized("Staff member not found");
    }

    return deliveryRepository.countStaffDeliveries(
      staffUser.internalId,
      query
    );
  },

  async getStaffDeliveryByUuid(
    sessionUserId: string,
    uuid: string
  ): Promise<StaffDeliveryDetailResponse> {
    const staffUser = await userRepository.findById(sessionUserId);
    if (!staffUser || !staffUser.internalId) {
      throw ApiError.unauthorized("Staff member not found");
    }

    const s = await deliveryRepository.findStaffDeliveryByUuid(
      uuid,
      staffUser.internalId
    );

    if (!s) {
      const anyShipment = await deliveryRepository.findShipmentByUuidOnly(uuid);
      if (anyShipment) {
        throw ApiError.forbidden("You do not have access to this delivery");
      }
      throw ApiError.notFound("Delivery not found");
    }

    return {
      id: s.uuid || String(s.id),
      status: s.status,
      assignmentStatus: s.assignment_status || "pending",
      deliveryNotes: s.delivery_notes,
      acceptedAt: s.accepted_at,
      shippedAt: s.shipped_at,
      deliveredAt: s.delivered_at,
      order: {
        id: s.orders.uuid || String(s.orders.id),
        orderNumber: s.orders.orderNumber,
        orderStatus: s.orders.order_status,
        paymentStatus: s.orders.payment_status,
        totalAmount: Number(s.orders.totalAmount),
        notes: s.orders.notes,
        placedAt: s.orders.placed_at,
        createdAt: s.orders.createdAt,
      },
      customer: {
        id: s.orders.user.uuid || String(s.orders.user.id),
        name: s.orders.user.name,
        email: s.orders.user.email,
        phone: s.orders.user.phone,
      },
      shippingAddress: formatShippingAddress(s.orders.address),
      deliverySlot: s.orders.delivery_slots
        ? {
          id: s.orders.delivery_slots.uuid || String(s.orders.delivery_slots.id),
          slotDate: s.orders.delivery_slots.slot_date
            ? s.orders.delivery_slots.slot_date.toISOString().split("T")[0]
            : null,
          startTime: s.orders.delivery_slots.start_time
            ? s.orders.delivery_slots.start_time.toISOString().substring(11, 19)
            : null,
          endTime: s.orders.delivery_slots.end_time
            ? s.orders.delivery_slots.end_time.toISOString().substring(11, 19)
            : null,
        }
        : null,
      trackingHistory: (s.shipment_tracking || []).map((t) => ({
        status: t.status,
        location: t.location,
        note: t.note,
        trackedAt: t.tracked_at,
      })),
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    };
  },

  async acceptDelivery(
    sessionUserId: string,
    uuid: string
  ) {
    const staffUser = await userRepository.findById(sessionUserId);
    if (!staffUser || !staffUser.internalId) {
      throw ApiError.unauthorized("Staff member not found");
    }

    const shipment = await deliveryRepository.findStaffDeliveryByUuid(
      uuid,
      staffUser.internalId
    );

    if (!shipment) {
      const anyShipment = await deliveryRepository.findShipmentByUuidOnly(uuid);
      if (anyShipment) {
        throw ApiError.forbidden("You do not have access to this delivery");
      }
      throw ApiError.notFound("Delivery not found");
    }

    if (shipment.assignment_status === "accepted" || shipment.status === "picked_up") {
      throw ApiError.badRequest("Delivery assignment has already been accepted");
    }

    if (shipment.assignment_status !== "pending") {
      throw ApiError.badRequest(
        `Delivery cannot be accepted in '${shipment.assignment_status}' assignment state`
      );
    }

    const updated = await deliveryRepository.acceptDeliveryTransaction(
      shipment.id,
      staffUser.internalId
    );

    return {
      id: updated.uuid || String(updated.id),
      status: updated.status,
      assignmentStatus: updated.assignment_status || "accepted",
      acceptedAt: updated.accepted_at,
    };
  },

  async markOutForDelivery(
    sessionUserId: string,
    uuid: string
  ): Promise<DeliveryTransitionResult> {
    const staffUser = await userRepository.findById(sessionUserId);
    if (!staffUser || !staffUser.internalId) {
      throw ApiError.unauthorized("Staff member not found");
    }

    const shipment = await deliveryRepository.findStaffDeliveryByUuid(
      uuid,
      staffUser.internalId
    );

    if (!shipment) {
      const anyShipment = await deliveryRepository.findShipmentByUuidOnly(uuid);
      if (anyShipment) {
        throw ApiError.forbidden("You do not have access to this delivery");
      }
      throw ApiError.notFound("Delivery not found");
    }

    if (shipment.assignment_status !== "accepted") {
      throw ApiError.badRequest(
        "Delivery must be accepted before marking out for delivery"
      );
    }

    if (shipment.status === "out_for_delivery") {
      throw ApiError.badRequest("Delivery is already marked as out for delivery");
    }

    if (shipment.status === "delivered") {
      throw ApiError.badRequest("Delivery is already delivered");
    }

    if (shipment.orders.order_status !== "packed") {
      throw ApiError.badRequest(
        `Order status is '${shipment.orders.order_status}'. Only 'packed' orders can be transitioned to 'out_for_delivery'.`
      );
    }

    const result = await deliveryRepository.markOutForDeliveryTransaction(
      shipment.id,
      shipment.orders.id,
      staffUser.internalId
    );

    return {
      shipmentId: result.shipment.uuid || String(result.shipment.id),
      orderId: result.order.uuid || String(result.order.id),
      shipmentStatus: result.shipment.status,
      orderStatus: result.order.order_status,
    };
  },

  async markDelivered(
    sessionUserId: string,
    uuid: string,
    input?: MarkDeliveredInput
  ): Promise<DeliveryTransitionResult> {
    const staffUser = await userRepository.findById(sessionUserId);
    if (!staffUser || !staffUser.internalId) {
      throw ApiError.unauthorized("Staff member not found");
    }

    const shipment = await deliveryRepository.findStaffDeliveryByUuid(
      uuid,
      staffUser.internalId
    );

    if (!shipment) {
      const anyShipment = await deliveryRepository.findShipmentByUuidOnly(uuid);
      if (anyShipment) {
        throw ApiError.forbidden("You do not have access to this delivery");
      }
      throw ApiError.notFound("Delivery not found");
    }

    if (shipment.status === "delivered") {
      throw ApiError.badRequest("Delivery is already marked as delivered");
    }

    if (shipment.status !== "out_for_delivery") {
      throw ApiError.badRequest(
        `Shipment status is '${shipment.status}'. Only 'out_for_delivery' shipments can be marked as delivered.`
      );
    }

    if (shipment.orders.order_status !== "out_for_delivery") {
      throw ApiError.badRequest(
        `Order status is '${shipment.orders.order_status}'. Only 'out_for_delivery' orders can be marked as delivered.`
      );
    }

    const result = await deliveryRepository.markDeliveredTransaction(
      shipment.id,
      shipment.orders.id,
      staffUser.internalId,
      input?.note
    );

    return {
      shipmentId: result.shipment.uuid || String(result.shipment.id),
      orderId: result.order.uuid || String(result.order.id),
      shipmentStatus: result.shipment.status,
      orderStatus: result.order.order_status,
    };
  },

  async markFailed(
    sessionUserId: string,
    uuid: string,
    input?: MarkFailedInput
  ): Promise<DeliveryTransitionResult> {
    const staffUser = await userRepository.findById(sessionUserId);
    if (!staffUser || !staffUser.internalId) {
      throw ApiError.unauthorized("Staff member not found");
    }

    const shipment = await deliveryRepository.findStaffDeliveryByUuid(
      uuid,
      staffUser.internalId
    );

    if (!shipment) {
      const anyShipment = await deliveryRepository.findShipmentByUuidOnly(uuid);
      if (anyShipment) {
        throw ApiError.forbidden("You do not have access to this delivery");
      }
      throw ApiError.notFound("Delivery not found");
    }

    const result = await deliveryRepository.markFailedTransaction(
      shipment.id,
      shipment.orders.id,
      staffUser.internalId,
      input?.reason,
      input?.note
    );

    return {
      shipmentId: result.shipment.uuid || String(result.shipment.id),
      orderId: result.order.uuid || String(result.order.id),
      shipmentStatus: result.shipment.status,
      orderStatus: result.order.order_status,
    };
  },

  async shipViaDelhivery(
    input: ShipViaCourierInput,
    adminEmail?: string | null
  ): Promise<CourierShipmentResult> {
    if (!isDelhiveryConfigured()) {
      throw ApiError.badRequest(
        "Delhivery is not configured. Set DELHIVERY_API_BASE_URL, DELHIVERY_API_TOKEN and DELHIVERY_PICKUP_LOCATION."
      );
    }

    const adminId = await getAdminInternalId(adminEmail);

    const order = await deliveryRepository.findOrderForCourierShipment(input.orderId);
    if (!order) {
      throw ApiError.notFound("Order not found");
    }

    if (order.order_status !== "packed") {
      throw ApiError.badRequest(
        `Cannot ship order with status '${order.order_status}'. Order must be in 'packed' status.`
      );
    }

    const activeShipment = await deliveryRepository.findActiveShipmentByOrderId(order.id);
    if (activeShipment) {
      throw ApiError.conflict("Order already has an active shipment");
    }

    const shippingAddress =
      order.address.find((a) => a.type === "shipping") ?? order.address[0] ?? null;
    if (!shippingAddress) {
      throw ApiError.badRequest("Order has no shipping address to ship to");
    }

    const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

    let created;
    try {
      created = await createDelhiveryShipment({
        orderNumber: order.orderNumber,
        paymentMode: order.payment_status === "paid" ? "Prepaid" : "COD",
        codAmount: order.payment_status === "paid" ? 0 : Number(order.totalAmount),
        totalAmount: Number(order.totalAmount),
        quantity: quantity || 1,
        consignee: {
          name: shippingAddress.full_name,
          addressLine1: shippingAddress.address_line1,
          addressLine2: shippingAddress.address_line2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          phone: shippingAddress.phone,
        },
      });
    } catch (error) {
      throw ApiError.badRequest(
        error instanceof Error ? error.message : "Failed to create Delhivery shipment"
      );
    }

    const partner = await deliveryRepository.findOrCreateDelhiveryPartner(adminId);

    const { shipment } = await deliveryRepository.createCourierShipmentTransaction({
      orderId: order.id,
      partnerId: partner.id,
      trackingNumber: created.waybill,
      adminId,
    });

    return {
      id: shipment.uuid || String(shipment.id),
      orderId: order.uuid || String(order.id),
      carrier: partner.name,
      trackingNumber: created.waybill,
      trackingUrl: getDelhiveryTrackingUrl(created.waybill),
      status: shipment.status,
    };
  },

  async refreshCourierTracking(
    input: RefreshCourierTrackingInput,
    adminEmail?: string | null
  ): Promise<RefreshCourierTrackingResult> {
    if (!isDelhiveryConfigured()) {
      throw ApiError.badRequest(
        "Delhivery is not configured. Set DELHIVERY_API_BASE_URL, DELHIVERY_API_TOKEN and DELHIVERY_PICKUP_LOCATION."
      );
    }

    const adminId = await getAdminInternalId(adminEmail);

    const shipment = await deliveryRepository.findCourierShipmentByUuid(input.shipmentId);
    if (!shipment) {
      throw ApiError.notFound("Shipment not found");
    }
    if (!shipment.tracking_number) {
      throw ApiError.badRequest("This shipment has no courier tracking number");
    }

    let tracking;
    try {
      tracking = await trackDelhiveryShipment(shipment.tracking_number);
    } catch (error) {
      throw ApiError.badRequest(
        error instanceof Error ? error.message : "Failed to fetch Delhivery tracking"
      );
    }

    const knownKeys = new Set(
      (shipment.shipment_tracking || []).map(
        (t) => `${t.status}|${t.tracked_at?.toISOString() ?? ""}`
      )
    );

    const newScans = tracking.scans
      .filter((scan) => {
        const trackedAt = scan.scanDateTime ? new Date(scan.scanDateTime) : new Date();
        return !knownKeys.has(`${scan.status}|${trackedAt.toISOString()}`);
      })
      .map((scan) => ({
        status: scan.status,
        location: scan.location,
        note: scan.instructions,
        trackedAt: scan.scanDateTime ? new Date(scan.scanDateTime) : new Date(),
      }));

    const classification = classifyDelhiveryStatus(tracking.status);
    const finalOrderStatus =
      classification === "delivered"
        ? "delivered"
        : classification === "out_for_delivery"
          ? "out_for_delivery"
          : classification === "in_transit" && shipment.orders.order_status === "packed"
            ? "shipped"
            : undefined;

    if (newScans.length > 0 || classification) {
      await deliveryRepository.appendCourierTrackingTransaction({
        shipmentId: shipment.id,
        orderId: shipment.orders.id,
        newScans,
        finalShipmentStatus: classification ?? undefined,
        finalOrderStatus,
        adminId,
      });
    }

    const refreshed = await deliveryRepository.findCourierShipmentByUuid(input.shipmentId);

    return {
      id: shipment.uuid || String(shipment.id),
      orderId: shipment.orders.uuid || String(shipment.orders.id),
      status: refreshed?.status || shipment.status,
      timeline: (refreshed?.shipment_tracking || []).map((t) => ({
        status: t.status,
        location: t.location,
        note: t.note,
        trackedAt: t.tracked_at,
      })),
    };
  },
};
