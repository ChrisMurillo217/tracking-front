import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlAPI : string = 'http://192.168.20.14:8086/api';

  constructor( private __http: HttpClient ) { }

}
