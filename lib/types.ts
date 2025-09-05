export type CartType = {
  id: number | null;
  userId: number | null;
  productId: number | null;
  name: string;
  cost: number;
  imageSrc: string;
  amount: number;
};

export type UserType = {
  id: number | null;
  name: string;
  password: string;
  isAdmin: boolean;
  cart: CartType[];
  avatar: string;
  needRefresh: boolean;
};

export type CommentType = {
  id: string;
  text: string;
  date: string;
  author: string;
};

export type ProductType = {
  id: number;
  name: string;
  category: string;
  viewed: number;
  rating: { author: number; rating: number }[];
  cost: number;
  imageSrc: string[];
  description: string;
  comments: CommentType[];
};

export type SortType = "name" | "cost" | "rating" | "viewed";

export type OrderType = {
  id: number | null;
  clientId: number;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  street?: string;
  house?: string;
  apartment?: string;
  products: CartType[];
  isDone: "0" | "1";
  date: string;
};

export type EncryptedOrderType = Pick<OrderType, "id" | "isDone"> & {
  clientId: number;
  encryptedOrder: string;
};

export type SearchParamsType = {
  name?: string;
  limit?: number;
  page?: number;
  category?: string;
  sortBy?: SortType;
  sortByDirection?: "asc" | "desc";
};

export type LoginState = {
  error?: string;
  message?: string;
  formData?: {
    name: string;
    password: string;
    confirmPassword?: string;
  };
};

export type UpdateUserState = {
  id: number | null;
  message?: string | null;
  error?: string | null;
  formData: {
    avatar?: string | null;
  };
};

export type UpdateCommentsState = {
  error?: string;
  message?: string;
  formData?: {
    text: string;
  };
};

export type UpdateCartState = {
  error?: string | null;
  message?: string;
  formData?: {
    cart: CartType | null;
  };
  fromCart?: boolean;
};

export type OrdersListParamsType = {
  limit: number;
  done: string;
  isAdmin: boolean;
};

export type CreateOrderState = {
  error?: string | null;
  message?: string;
  formData?: OrderType;
};

export type UpdateOrderState = {
  error?: string | null;
  message?: string;
  formData?: {
    isDone: "0" | "1";
    id: number;
  };
};
