import { Component, OnInit } from '@angular/core';
import { OfService } from 'src/app/services/of.service';
import { PedidoList } from '../../models/pedido.model';
import { Fabricacion } from '../../models/ofSap.model';

@Component({
  selector: 'app-fabricacion',
  templateUrl: './fabricacion.component.html',
  styleUrls: ['./fabricacion.component.css']
})
export class FabricacionComponent implements OnInit {
  OF:               any;
  filteredPedidos:  any[] = [];
  OFs:              any[] = [];
  selectedPedido:   string = '';
  item:             any;
  codigoItem:       any;
  fechaIngreso:     Date | string | null = null;
  fechaEntrega:     Date | null = null;

  constructor( private ofService: OfService ) { }

  ngOnInit() {
    this.ofService.getOFsbyPedido().subscribe(
      ( ofs: PedidoList[] ) => {
        const uniquePedidos = new Set();

        ofs.forEach( ( of: PedidoList ) => {
          const pedidoLabel = of.pedidoCliente.toString();

          if ( !uniquePedidos.has( pedidoLabel ) ) {
            uniquePedidos.add( pedidoLabel );

            this.filteredPedidos.push( {
              label: pedidoLabel,
              value: of
            } );
          }
        } );
      }
    );
  }

  filterPedido( event: any ) {
    const query = event.query.toLowerCase();

    this.filteredPedidos = this.filteredPedidos.filter( ( of: any ) => {
      return of.label.toLowerCase().includes( query );
    } );
  }

  filterOF( event: any ) {
    const query = event.query.toLowerCase();

    this.OFs = this.OFs.filter( ( of: any ) => {
      return of.label.toLowerCase().includes( query );
    } );
  }

  onPedidoSelect( event: any ) {
    if ( event.value ) {
      const pedidoSeleccionado = event.value.pedidoCliente;

      this.selectedPedido = pedidoSeleccionado;

      this.ofService.getOf( this.selectedPedido ).subscribe(
        ( ofs: Fabricacion[] ) => {
          this.OFs = ofs.map( ( of ) => ( {
            label: of.OF.toString(),
            value: of
          } ) );
        },
        (error: any) => {
          console.error('Error al obtener las órdenes de fabricación', error);
        }
      );
    }
  }

  onOFSelect( event: any ) {
    if ( event.value ) {
      const ofSeleccionado: Fabricacion = event.value;

      this.codigoItem = ofSeleccionado.Item;
      this.item = ofSeleccionado.Descripcion;

      const fechaIngreso = new Date( ofSeleccionado.StartDate );
      const formattedFechaIngreso = fechaIngreso.toISOString().split( 'T' )[ 0 ];

      this.fechaIngreso = formattedFechaIngreso;
    }
  }

  guardarOF() {
    if ( this.fechaEntrega && this.fechaIngreso ) {
      const nuevaOF: Fabricacion = {
        Pedido: this.OF?.value.Pedido,
        PostDate: new Date(),
        DueDate: new Date( this.fechaEntrega ),
        StartDate: new Date( this.fechaIngreso ),
        OF: this.OF?.value.OF,
        Item: this.codigoItem,
        Descripcion: this.item
      };

      this.ofService.createOF( nuevaOF ).subscribe(
        ( response: any ) => {
          console.log( response.message );
        },
        ( error: any ) => {
          console.error( 'Error al crear la orden de fabricación', error );
        }
      );
    } else {
      console.error( 'Las fechas son nulas o no válidas' );
    }
  }
}
