export type CartType = Pick<ProductType, "id" | "name" | "cost" | "imageSrc"> & {
  amount: number;
};

// export type CartType = {
//   productId: number | null;
//   amount: number;
// };

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
  id: number;
  name: string;
  category: string;
  viewed: number;
  rating: { author: number; rating: number }[];
  cost: number;
  imageSrc: string[] | string;
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

export type SearchParamsType = {
  name?: string;
  limit?: number;
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
  };
};

export type UpdateUserState = {
  id: number | null;
  message: string | null;
  errors: { [key: string]: string };
  formData: {
    product?: Pick<ProductType, "id" | "name" | "cost" | "imageSrc"> & { amount: number };
    avatar?: string;
  };
  isCart?: boolean;
};

export type UpdateCommentsState = {
  error?: string;
  message?: string;
  formData?: {
    text: string;
  };
};
