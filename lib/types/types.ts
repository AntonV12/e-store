export type CartType = Pick<ProductType, "id" | "name" | "cost" | "imageSrc"> & {
  amount: number;
};

export type UserType = {
  id: number | null;
  name: string;
  password: string;
  isAdmin: boolean;
  cart: CartType[];
  avatar: string;
};

export type CommentType = {
  id: string;
  text: string;
  date: string;
  author: string;
};

export type ProductType = {
  id: number | null;
  name: string;
  category: string;
  viewed: number;
  rating: { author: number; rating: number }[];
  cost: number;
  imageSrc: string;
  description: string;
  comments: CommentType[];
};

export type SortType = "name" | "cost" | "rating" | "viewed";

export type OrderType = {
  id: number | null;
  clientId: number;
  phone: string;
  email: string;
  address: string;
  products: CartType[];
  isDone: boolean;
  date: string;
};

export type EncryptedOrderType = Pick<OrderType, "id" | "clientId" | "isDone"> & { encryptedOrder: string };
