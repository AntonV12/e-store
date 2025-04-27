export type UserType = {
  id: number | null;
  name: string;
  password: string;
};

export type ProductType = {
  id: number | null;
  name: string;
  category: string;
  viewed: number;
  rating: number;
  cost: number;
  imageSrc: string;
};
