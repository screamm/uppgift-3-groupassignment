import { Key } from "react";

export interface IProduct {
  id: Key | null | undefined;
  name: string;
  price: number;
}