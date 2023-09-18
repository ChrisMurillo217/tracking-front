export interface Fabricacion {
  Pedido: number;
  OF: number;
  PostDate: Date; // Creación de la orden de fabrición
  StartDate: Date; // Inicio de la orden de fabricación
  DueDate: Date; //Fin de la orden de fabricación
  ItemCode: string[];
  Dscription: string[];
}
