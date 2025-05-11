export type CartType = Pick<ProductType, "id" | "name" | "cost" | "imageSrc"> & {
  amount: number;
};

export type UserType = {
  id: number | null;
  name: string;
  password: string;
  isAdmin: boolean;
  cart: CartType[];
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
  rating: { author: string; rating: number }[];
  cost: number;
  imageSrc: string;
  description: string;
  comments: CommentType[];
};

export type OrderType = {
  id: number | null;
  clientId: number;
  phone: number;
  email: string;
  address: string;
  products: CartType[];
};
