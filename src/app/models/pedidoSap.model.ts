export interface Pedido {
  DocNum: number;
  DocDate: Date;
  DocDueDate: Date;
  TaxDate: Date;
  CANCELED: string;
  CardCode: string;
  CardName: string;
  ItemCode: string[];
  Dscription: string[];
  Quantity: number;
}
