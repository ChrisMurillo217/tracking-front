import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./guards/auth.guard";

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { FabricacionComponent } from './components/fabricacion/fabricacion.component';
import { TrackingListComponent } from './components/tracking-list/tracking-list.component';
import { TrackingComponent } from './components/tracking/tracking.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login' , component: LoginComponent },
  { path: 'home' , component: HomeComponent },
  { path: 'pedidos' , component: PedidosComponent },
  { path: 'fabricacion' , component: FabricacionComponent },
  { path: 'trackingList' , component: TrackingListComponent },
  { path: 'tracking/:pedidoCliente' , component: TrackingComponent },
];

@NgModule( {
  imports: [
    RouterModule.forRoot( routes )
  ],
  exports: [
    RouterModule
  ]
} )
export class AppRoutingModule { }
