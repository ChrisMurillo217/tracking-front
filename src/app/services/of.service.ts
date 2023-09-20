import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Fabricacion } from '../models/ofSap.model';
import { PedidoList } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class OfService {
  urlAPI : string = 'http://192.168.20.14:8086/api';

  constructor( private __http: HttpClient ) { }

  getOFsbyPedido(): Observable<PedidoList[]> {
    const url = `${ this.urlAPI }/fabricacion/with-of`;
    return this.__http.get<PedidoList[]>( url ).pipe(
      catchError( ( error ) => {
        return throwError( error );
      } )
    );
  }

  getOf( pedido: string ): Observable<any[]> {
    const url = `${ this.urlAPI }/fabricacion/ofs/${ pedido }`;
    return this.__http.get<Fabricacion[]>( url ).pipe(
      catchError( ( error ) => {
        return throwError( error );
      } )
    );
  }

  getItemsByOF( of: string ): Observable<string> {
    const url = `${ this.urlAPI }/fabricacion/ofs/${ of }`;
    return this.__http.get<string>( url ).pipe(
      catchError( ( error ) => {
        return throwError( error );
      })
    );
  }

  getDescripcionesByOF( of: string ): Observable<string> {
    const url = `${ this.urlAPI }/fabricacion/ofs/${ of }`;
    return this.__http.get<string>( url ).pipe(
      catchError( ( error ) => {
        return throwError( error );
      })
    );
  }

  createOF( of: Fabricacion ): Observable<any> {
    const url = `${ this.urlAPI }/fabricacion`;
    return this.__http.post( url, of ).pipe(
      catchError( ( error ) => {
        return throwError( error );
      } )
    );
  }
}
