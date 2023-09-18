export interface Fabricacion {
  idPedido: number;
  ordFabricacion: number;
  fechaCreacion: Date; // Creación de la orden de fabrición
  fechaInicial: Date; // Inicio de la orden de fabricación
  fechaFin: Date; //Fin de la orden de fabricación
  codigoItems: string[];
  items: string[];
}
