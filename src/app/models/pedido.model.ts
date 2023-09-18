export interface PedidoList {
  idClienteP: string;
  nombreClienteP: string;
  pedidoCliente: number;
  estadoPedido: string;
  codigoItems: string;
  items: {}[];
  fechaContabilizacion: Date;
  fechaEntrega: Date;
}
