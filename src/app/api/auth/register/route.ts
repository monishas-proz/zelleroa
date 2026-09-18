import { createApiHandler } from "@/lib/api/api-handler";
import { apiCreated } from "@/lib/api/api-response";
import { registerSchema, type RegisterInput } from "@/features/users/validations/user.schema";
import { userService } from "@/features/users/services/user.service";

export const POST = createApiHandler(
  {
    POST: async (request, context) => {
      const body = context.body as RegisterInput;

      const user = await userService.registerUserWithToken(body, request);

      return apiCreated(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        "Registration successful"
      );
    },
  },
  {
    method: "POST",
    bodySchema: registerSchema,
    rateLimit: { limit: 10, windowMs: 60_000 },
  }
);
