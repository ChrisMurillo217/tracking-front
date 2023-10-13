import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { PedidoList } from '../models/pedido.model';
import { Guia } from "src/app/models/guiaSap.model";
import { GuiaList } from '../models/guia.model';

@Injectable( {
  providedIn: 'root'
} )
export class GuiaService {
  urlAPI: string = 'http://localhost:3000/api';

  constructor( private __http: HttpClient ) { }

  getPedidos(): Observable< PedidoList[] > {
    const url = `${ this.urlAPI }/trackingList`;
    return this.__http.get< PedidoList[] >( url ).pipe(
      catchError( ( error ) => {
        console.error('Error al obtener números de pedido:', error);
        return throwError( error );
      } )
    );
  }

  getGuia( item: string, pedido: string ): Observable< Guia[] > {
    const url = `${ this.urlAPI }/guia/ItemCode=${ item }&Comments=${ pedido }`;
    return this.__http.get< Guia[] >( url ).pipe(
      catchError( ( error ) => {
        console.error('Error al obtener números de pedido:', error);
        return throwError( error );
      } )
    );
  }

  createGuia( guia: GuiaList ): Observable< any > {
    const url = `${ this.urlAPI }/guia`;
    return this.__http.post( url, guia ).pipe(
      catchError( ( error ) => {
        return throwError( error );
      } )
    )
  }
}
