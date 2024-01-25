export enum ProductType {
  Food = 'FOOD',
  SideDish = 'SIDE_DISH',
  Drink = 'DRINK',
  Dessert = 'DESSERT',
}

export type Product = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  type: ProductType;
  name: string;
  description: string;
  price: number;
};
