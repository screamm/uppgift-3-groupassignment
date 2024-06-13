import { Key } from "react";

export interface IProduct {
  id: Key | null | undefined;
  name: string;
  price: number;
  priceId: string; // Lägg till priceId här
}

export interface IArticle extends Document {
  id: Key | null | undefined;
  level: string;
  stripeProductId: string;
  description: string;
  title: string;
  createdAt: Date;
}