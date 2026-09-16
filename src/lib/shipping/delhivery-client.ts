/**
 * Delhivery direct API client.
 *
 * Requires DELHIVERY_API_BASE_URL, DELHIVERY_API_TOKEN and
 * DELHIVERY_PICKUP_LOCATION env vars. Until those are set, isDelhiveryConfigured()
 * returns false and the create/track calls below throw instead of silently
 * no-op-ing, so callers can surface a clear "not configured" error.
 *
 * Endpoint shapes follow Delhivery's published Shipment (cmu/create) and
 * Tracking (packages/json) APIs; re-verify field names against Delhivery's
 * current docs/Postman collection once real credentials are available, since
 * this was built without a live account to test against.
 */

interface DelhiveryConfig {
  baseUrl: string;
  token: string;
  pickupLocation: string;
}

function getDelhiveryConfig(): DelhiveryConfig | null {
  const baseUrl = process.env.DELHIVERY_API_BASE_URL?.trim().replace(/\/+$/, "");
  const token = process.env.DELHIVERY_API_TOKEN?.trim();
  const pickupLocation = process.env.DELHIVERY_PICKUP_LOCATION?.trim();
  if (!baseUrl || !token || !pickupLocation) return null;
  return { baseUrl, token, pickupLocation };
}

export function isDelhiveryConfigured(): boolean {
  return getDelhiveryConfig() !== null;
}

export function getDelhiveryTrackingUrl(waybill: string): string {
  return `https://www.delhivery.com/track-v2/package/${encodeURIComponent(waybill)}`;
}

export interface DelhiveryConsignee {
  name: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface CreateDelhiveryShipmentParams {
  orderNumber: string;
  paymentMode: "COD" | "Prepaid";
  codAmount: number;
  totalAmount: number;
  consignee: DelhiveryConsignee;
  quantity: number;
}

export interface CreateDelhiveryShipmentResult {
  waybill: string;
  status: string;
}

class DelhiveryNotConfiguredError extends Error {
  constructor() {
    super(
      "Delhivery is not configured. Set DELHIVERY_API_BASE_URL, DELHIVERY_API_TOKEN and DELHIVERY_PICKUP_LOCATION."
    );
    this.name = "DelhiveryNotConfiguredError";
  }
}

export async function createDelhiveryShipment(
  params: CreateDelhiveryShipmentParams
): Promise<CreateDelhiveryShipmentResult> {
  const config = getDelhiveryConfig();
  if (!config) throw new DelhiveryNotConfiguredError();

  const shipmentPayload = {
    shipments: [
      {
        name: params.consignee.name,
        add: params.consignee.addressLine1,
        address2: params.consignee.addressLine2 || "",
        city: params.consignee.city,
        state: params.consignee.state,
        pin: params.consignee.pincode,
        phone: params.consignee.phone,
        order: params.orderNumber,
        payment_mode: params.paymentMode,
        cod_amount: params.paymentMode === "COD" ? params.codAmount : 0,
        total_amount: params.totalAmount,
        quantity: params.quantity,
        country: "India",
      },
    ],
    pickup_location: { name: config.pickupLocation },
  };

  const body = `format=json&data=${encodeURIComponent(JSON.stringify(shipmentPayload))}`;

  const res = await fetch(`${config.baseUrl}/api/cmu/create.json`, {
    method: "POST",
    headers: {
      Authorization: `Token ${config.token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    throw new Error(
      `Delhivery create-shipment request failed (${res.status}): ${
        data ? JSON.stringify(data) : await res.text().catch(() => "")
      }`
    );
  }

  const packageResult = data?.packages?.[0];
  if (!packageResult?.waybill) {
    throw new Error(
      data?.rmk || packageResult?.remarks?.join(", ") || "Delhivery did not return a waybill"
    );
  }

  return {
    waybill: packageResult.waybill,
    status: packageResult.status || "pending",
  };
}

export interface DelhiveryTrackingScan {
  status: string;
  location: string | null;
  instructions: string | null;
  scanDateTime: string | null;
}

export interface TrackDelhiveryShipmentResult {
  status: string;
  scans: DelhiveryTrackingScan[];
}

export async function trackDelhiveryShipment(
  waybill: string
): Promise<TrackDelhiveryShipmentResult> {
  const config = getDelhiveryConfig();
  if (!config) throw new DelhiveryNotConfiguredError();

  const url = `${config.baseUrl}/api/v1/packages/json/?waybill=${encodeURIComponent(waybill)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Token ${config.token}`,
      Accept: "application/json",
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    throw new Error(`Delhivery tracking request failed (${res.status})`);
  }

  const shipment = data?.ShipmentData?.[0]?.Shipment;
  if (!shipment) {
    throw new Error("Delhivery returned no tracking data for this waybill");
  }

  const scans: DelhiveryTrackingScan[] = (shipment.Scans || []).map((entry: any) => ({
    status: entry?.ScanDetail?.Scan || entry?.ScanDetail?.ScanType || "unknown",
    location: entry?.ScanDetail?.ScannedLocation || null,
    instructions: entry?.ScanDetail?.Instructions || null,
    scanDateTime: entry?.ScanDetail?.ScanDateTime || null,
  }));

  return {
    status: shipment?.Status?.Status || "unknown",
    scans,
  };
}
