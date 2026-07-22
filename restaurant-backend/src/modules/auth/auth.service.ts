import bcrypt from "bcrypt";
import { AppError } from "../../shared/errors.js";
import type { StaffProfile, StaffToken } from "../../types/index.js";
import { findStaffUserByEmail } from "./auth.repository.js";

const invalidCredentials = new AppError(401, "INVALID_CREDENTIALS", "Wrong email or password");

export async function verifyLogin(email: string, password: string) {
  const user = await findStaffUserByEmail(email);
  if (!user) throw invalidCredentials;

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) throw invalidCredentials;

  if (!user.restaurantId || !user.role) {
    throw new AppError(403, "NO_RESTAURANT", "User is not connected to a restaurant");
  }

  const token: StaffToken = {
    userId: user.id,
    restaurantId: user.restaurantId,
    role: user.role,
    email: user.email,
  };

  const profile: StaffProfile = {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    restaurantId: user.restaurantId,
    restaurantName: user.restaurantName,
  };

  return { token, profile };
}
