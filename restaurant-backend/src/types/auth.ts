export type StaffRole = "owner" | "staff";

export type StaffToken = {
  userId: string;
  restaurantId: string;
  role: StaffRole;
  email: string;
};

export type StaffUser = {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  restaurantId: string | null;
  role: StaffRole | null;
  restaurantName: string | null;
};

export type StaffProfile = {
  id: string;
  email: string;
  displayName: string;
  role: StaffRole;
  restaurantId: string;
  restaurantName: string | null;
};
