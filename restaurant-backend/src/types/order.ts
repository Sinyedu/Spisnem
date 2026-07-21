export type OrderStatus =
  | "submitted"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentMethod = "pay_at_restaurant" | "mock_card";

export type Order = {
  id: string;
  restaurantId: string;
  queueEntryId: string | null;
  customerName: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  subtotalMinor: number;
  totalMinor: number;
  currency: string;
  customerNotes: string | null;
  submittedAt: string;
  confirmedAt: string | null;
  preparingAt: string | null;
  readyAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
};

export type OrderItem = {
  id: string;
  orderId: string;
  menuItemId: string | null;
  itemName: string;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
  notes: string | null;
};

export type OrderWithItems = Order & { items: OrderItem[] };

export type CreateOrderItemInput = {
  menuItemId: string;
  quantity: number;
  notes?: string | undefined;
};

export type CreateOrderInput = {
  customerName: string;
  queueToken?: string | undefined;
  customerNotes?: string | undefined;
  paymentMethod: PaymentMethod;
  items: CreateOrderItemInput[];
};

// A priced line, built on the server from database prices.
export type OrderLine = {
  menuItemId: string;
  itemName: string;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
  notes: string | null;
};

export type NewOrder = {
  restaurantId: string;
  queueEntryId: string | null;
  customerName: string;
  tokenHash: string;
  paymentMethod: PaymentMethod;
  subtotalMinor: number;
  totalMinor: number;
  currency: string;
  customerNotes: string | null;
};
