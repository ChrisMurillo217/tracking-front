import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { __param } from 'tslib';
import { ProgressService } from 'src/app/services/progress.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { PedidoList } from '../../models/pedido.model';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  pedido:                 PedidoList | any;
  progress:               number = 0;
  numeroItem:             number = 0;
  pedidoCliente:          any = '';
  estadoPedido:           string = '';
  fechaContabilizacion:   string = '';
  fechaEntrega:           string = '';
  tiempoEntrega:          string = '';

  constructor(
    private progressService: ProgressService,
    private route: ActivatedRoute,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe( ( params ) => {
      this.pedidoCliente = params.get( 'pedidoCliente' );
    } );

    this.pedidoService.getPedidoByDocNum( this.pedidoCliente ).subscribe(
      ( pedido ) => {
        this.pedido = pedido;
        this.estadoPedido = this.pedido[0].estadoPedido;
        this.fechaContabilizacion = this.formatDate( this.pedido[0].fechaContabilizacion );
        this.fechaEntrega = this.formatDate( this.pedido[0].fechaEntrega );
        this.tiempoEntrega = this.calcularTiempoEntrega(
          this.pedido[0].fechaContabilizacion,
          this.pedido[0].fechaEntrega
        );

        this.pedidoService.getPedidosByDocNum( this.pedidoCliente ).subscribe(
          ( items ) => {
            this.numeroItem = items.length;
          },
          ( error ) => {
            console.error( error );
          }
        )
      },
      ( error ) => {
        console.error( error );
      }
    );

    this.progressService.progress$.subscribe( ( progress ) => {
      this.progress = progress;
    } );
  }

  formatDate( dateString: string ): string {
    const date = new Date( dateString );
    const day = ( date.getDate() + 1 ).toString().padStart( 2, '0' );
    const month = ( date.getMonth() + 1 ).toString().padStart( 2, '0' );
    const year = date.getFullYear().toString();

    return `${ day }/${ month }/${ year }`;
  }

  calcularTiempoEntrega( fechaContabilizacion: Date, fechaFin: Date ): string {
    const fechaIngreso = new Date( fechaContabilizacion );
    const fechaEntrega = new Date( fechaFin );
    const tiempoMilisegundos = fechaEntrega.getTime() - fechaIngreso.getTime();
    const diasEntrega = tiempoMilisegundos / ( 1000 * 60 * 60 * 24 );
    return `${ Math.floor( diasEntrega ) } días`;
  }
}
