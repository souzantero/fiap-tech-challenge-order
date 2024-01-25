export type Customer = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  name: string;
  email: string;
  document: string;
};
