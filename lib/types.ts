export type CartType = {
  id: number | null;
  userId: string | null;
  productId: number | null;
  name: string;
  cost: number;
  imageSrc: string;
  amount: number;
  rating: number;
};

export type UserType = {
  id: string | null;
  name: string;
  password: string;
  isAdmin: boolean;
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
  rating: number;
  cost: number;
  imageSrc: string[];
  description: string;
  comments: CommentType[];
};

export type SortType = "name" | "cost" | "rating" | "viewed";

export type OrderType = {
  id: number | null;
  clientId: string;
  username: string;
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
  clientId: string;
  encryptedOrder: string;
};

export type SearchParamsType = {
  search?: string;
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
    password?: string;
    confirmPassword?: string;
    cart?: CartType[];
  };
};

export type UpdateUserState = {
  id?: string | null;
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

export type UpdateProductState = {
  error?: string;
  message?: string;
  formData?: {
    rating?: number;
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

export type SessionType = {
  isAuth: boolean;
  userId: string | null;
  isAdmin: boolean;
};

export type CreateProductState = {
  error?: string | null;
  message?: string;
  formData?: ProductType;
};

export type DeleteProductState = {
  error?: string | null;
  message?: string;
  formData?: {
    images: string[];
  };
};

export type LogoutStateType = {
  error?: string | null;
  message?: string | null;
};
