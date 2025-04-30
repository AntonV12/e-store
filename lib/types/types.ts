export type UserType = {
  id: number | null;
  name: string;
  password: string;
  isAdmin: boolean;
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
