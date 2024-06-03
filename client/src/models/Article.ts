import { Key, ReactElement, ReactNode, ReactPortal, JSXElementConstructor } from "react";

export interface IProduct {
  id: Key | null | undefined;
  name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
  price: number;
}