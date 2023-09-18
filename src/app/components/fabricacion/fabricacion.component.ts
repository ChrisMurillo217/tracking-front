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
  selectedOF:       any;
  OFs:              any[] = [];
  selectedPedido:   string = '';
  item:             any;
  codigoItem:       any;

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

  onOFSelect( event: any ) {
    if ( event.value ) {
      const ofSeleccionado = event.value.pedidoCliente;

      this.selectedPedido = ofSeleccionado;

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

      this.ofService.getItemsByOF( this.OF ).subscribe(
        ( response: any ) => {
          console.log(this.OF);

          this.codigoItem = response;
        },
        ( error: any ) => {
          console.error( 'Error al obtener los ItemCode', error );
        }
      )

      this.ofService.getItemsByOF( this.OF ).subscribe(
        ( response: any ) => {
          this.item = response;
        },
        ( error: any ) => {
          console.error( 'Error al obtener las descripciones', error );
        }
      )

    }
  }
}
