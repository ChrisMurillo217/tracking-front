import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {
  urlAPI : string = 'http://localhost:3000/api';

  constructor( private __http: HttpClient ) { }
}
