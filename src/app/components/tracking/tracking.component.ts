import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedidoSap.model';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  pedidos: Pedido[] = [];

  constructor( private pedidoService: PedidoService ) {}

  ngOnInit(): void {
    this.pedidoService.getPedidos().subscribe(
      ( data ) => {
        this.pedidos = data;
      },
      ( error ) => {
        console.error( error );
      }
    );
  }

}
