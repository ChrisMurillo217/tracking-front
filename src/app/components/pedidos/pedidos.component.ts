import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProgressService } from 'src/app/services/progress.service';
import { Pedido } from '../../models/pedidoSap.model';
import { PedidoList } from 'src/app/models/pedido.model';
import { GuiaService } from 'src/app/services/guia.service';

@Component( {
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
} )
export class PedidosComponent implements OnInit {
  selectedPedido:   any = {};
  filteredPedidos:  any[] = [];
  nombreCliente:    string = '';
  estadoPedido:     string = '';
  fechaIngreso:     Date | string | null = null;
  fechaEntrega:     Date | null = null;
  items:            string[] = [];
  codigoItems:      string[] = [];
  combinedData:     any = {};
  selectedDocNum:   string = '';
  pedidosGuardados: Pedido[] = [];
  existingPedidos:  string[] = [];
  TOTAL_PEDIDOS:    number = 0;

  constructor(
    private pedidoService: PedidoService,
    private progressService: ProgressService,
  ) { }

  ngOnInit() {
    this.pedidoService.getPedidosList().subscribe( ( existingPedidos: PedidoList[] ) => {
      this.existingPedidos = existingPedidos.map( ( pedido ) => pedido.pedidoCliente.toString() );

      const progresoExistente = ( this.existingPedidos.length / this.TOTAL_PEDIDOS ) * 100;

      this.progressService.updateProgress( progresoExistente );

      this.loadPedidosFromSap();
    } );
  }

  loadPedidosFromSap() {
    this.pedidoService.getPedidos().subscribe( ( pedidos: Pedido[] ) => {
      const uniquePedidos: Set< string > = new Set();

      pedidos.forEach( ( pedido: Pedido ) => {
        const pedidoLabel = pedido.DocNum.toString();

        if ( !uniquePedidos.has( pedidoLabel ) && !this.existingPedidos.some( ( existingPedidos ) => existingPedidos === pedidoLabel ) ) {
          uniquePedidos.add( pedidoLabel );

          this.filteredPedidos.push( {
            label: pedidoLabel,
            value: pedido
          } );
        }
      } );
    } );
  }

  filterPedido( event: any ) {
    const query = event.query.toLowerCase();

    this.filteredPedidos = this.filteredPedidos.filter( ( pedido: any ) => {
      return pedido.label.toLowerCase().includes( query );
    } );
  }

  onPedidoSelect( event: any ) {
    if ( event.value ) {
      const pedidoSeleccionado: Pedido = event.value;

      this.nombreCliente = pedidoSeleccionado.CardName;
      this.estadoPedido = pedidoSeleccionado.CANCELED;

      const fechaIngreso = new Date( pedidoSeleccionado.TaxDate );
      const formattedFechaIngreso = fechaIngreso.toISOString().split( 'T' )[ 0 ];

      this.fechaIngreso = formattedFechaIngreso;

      this.selectedDocNum = pedidoSeleccionado.DocNum.toString();

      this.pedidoService.getPedidosByDocNum( this.selectedDocNum ).subscribe(
        ( itemCodes: string[] ) => {
          this.codigoItems = itemCodes;
        },
        ( error: any ) => {
          console.error( 'Error al obtener los ItemCode', error );
        }
      )

      this.pedidoService.getDescripcionesByDocNum( this.selectedDocNum ).subscribe(
        ( descripciones: string[] ) => {
          this.items = descripciones;
        },
        ( error: any ) => {
          console.error( 'Error al obtener las descripciones', error );
        }
      )
    } else {
      this.nombreCliente = '';
      this.estadoPedido = '';
      this.fechaIngreso = null;
      this.items = [];
      this.codigoItems = [];
      this.selectedDocNum = '';
    }
  }

  guardarPedido() {
    if ( this.fechaEntrega && this.fechaIngreso ) {
      const nuevoPedido: Pedido = {
        DocNum: this.selectedPedido?.value.DocNum,
        DocDate: new Date(),
        DocDueDate: new Date( this.fechaEntrega ),
        TaxDate: new Date( this.fechaIngreso ),
        CANCELED: this.estadoPedido,
        CardCode: 'CN0590055328001',
        CardName: this.nombreCliente,
        ItemCode: this.codigoItems,
        Dscription: this.items,
        Quantity: 1
      };

      this.pedidoService.createPedido( nuevoPedido ).subscribe(
        ( response: any ) => {
          console.log( response.message );
          this.progressService.updateProgress( 33 );

          const index = this.filteredPedidos.findIndex( pedido => pedido.value.DocNum === nuevoPedido.DocNum );
          if ( index !== -1 ) {
            this.filteredPedidos.splice( index, 1 );
          }
        },
        ( error: any ) => {
          console.error( 'Error al crear el pedido', error );
        }
      );


    } else {
      console.error( 'Las fechas son nulas o no válidas' );
    }
  }
}
