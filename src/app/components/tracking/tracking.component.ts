import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfService } from 'src/app/services/of.service';
import { ProgressService } from 'src/app/services/progress.service';
import { PedidoList } from '../../models/pedido.model';
import { __param } from 'tslib';
import { PedidoService } from 'src/app/services/pedido.service';
import { Pedido } from 'src/app/models/pedidoSap.model';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  ofs: PedidoList[] = [];
  progress: number = 0;
  pedidoCliente: any = '';
  pedido: Pedido | any;

  constructor(
    private ofService: OfService,
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
        this.progressService.updateProgress( 66 );
      },
      ( error ) => {
        console.error( error );
      }
    );
  }

  formatDate( date: Date ): string {
    const day = ( date.getDate() + 1 ).toString().padStart( 2, '0' );
    const month = ( date.getMonth() + 1 ).toString().padStart( 2, '0' );
    const year = date.getFullYear().toString();

    return `${ day }/${ month }/${ year }`;
  }

  calcularTiempoEntrega( fechaIngreso: Date, fechaEntrega: Date ): string {
    const tiempoMilisegundos = fechaEntrega.getTime() - fechaIngreso.getTime();
    const diasEntrega = tiempoMilisegundos / ( 1000 * 60 * 60 * 24 );
    return `${ Math.floor( diasEntrega ) } días`;
  }
}
