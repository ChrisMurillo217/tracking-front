import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { PedidoList } from '../../models/pedido.model';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-tracking-list',
  templateUrl: './tracking-list.component.html',
  styleUrls: ['./tracking-list.component.css']
})
export class TrackingListComponent implements OnInit {
  pedidos:    PedidoList[] = [];
  first       = 0;

  constructor( private pedidoService: PedidoService, private progressService: ProgressService ) {}

  ngOnInit(): void {
    this.pedidoService.getPedidosList().subscribe(
      ( data ) => {
        this.pedidos = data;
      },
      ( error ) => {
        console.error( error );
      }
    );
  }

  formatDate( dateString: string ): string {
    const date = new Date( dateString );
    const day = ( date.getDate() + 1 ).toString().padStart( 2, '0' );
    const month = ( date.getMonth() + 1 ).toString().padStart( 2, '0' );
    const year = date.getFullYear().toString();

    return `${ day }/${ month }/${ year }`;
  }

  onPageChange( event: any ) {
    this.first = event.first;
  }

  onTrackingClick( pedidoCliente: string ) {
    this.progressService.updateProgress( 33 );
  }
}
