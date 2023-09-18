import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Pedido } from '../models/pedidoSap.model';
import { PedidoList } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  urlAPI : string = 'http://localhost:3000/api';

  constructor( private __http: HttpClient ) { }

  getPedidos(): Observable<Pedido[]> {
    const url = `${ this.urlAPI }/pedidos`;
    return this.__http.get<Pedido[]>( url ).pipe(
      catchError( ( error ) => {
        return throwError( error );
      } )
    );
  }

  createPedido( pedido: Pedido ): Observable<any> {
    const url = `${ this.urlAPI }/pedidos`;
    return this.__http.post( url, pedido ).pipe(
      catchError( ( error ) => {
        return throwError( error );
      } )
    );
  }

  getPedidosList(): Observable<PedidoList[]> {
    const url = `${ this.urlAPI }/trackinList`;
    return this.__http.get<PedidoList[]>( url ).pipe(
      catchError( ( error ) => {
        return throwError( error );
      } )
    );
  }

  getPedidosByDocNum( docNum: string ): Observable<string[]> {
    const url = `${ this.urlAPI }/pedidos/itemcodes/${ docNum }`;
    return this.__http.get<string[]>( url ).pipe(
      catchError( ( error ) => {
        return throwError( error );
      } )
    );
  }

  getDescripcionesByDocNum( docNum: string ): Observable<string[]> {
    const url = `${ this.urlAPI }/pedidos/descripciones/${ docNum }`;
    return this.__http.get<string[]>( url ).pipe(
      catchError( ( error ) => {
        return throwError( error );
      } )
    );
  }
}
