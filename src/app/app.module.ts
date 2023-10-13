import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { PedidoService } from './services/pedido.service';
import { OfService } from './services/of.service';
import { ProgressService } from './services/progress.service';
import { GuiaService } from './services/guia.service';

import { LoginComponent } from './components/login/login.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { FabricacionComponent } from './components/fabricacion/fabricacion.component';
import { TrackingListComponent } from './components/tracking-list/tracking-list.component';
import { TrackingComponent } from './components/tracking/tracking.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule( {
  declarations: [
    AppComponent,
    LoginComponent,
    PedidosComponent,
    FabricacionComponent,
    TrackingListComponent,
    TrackingComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ProgressBarModule,
    ToastModule,
    PaginatorModule,
    TableModule,
    AutoCompleteModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    PedidoService,
    OfService,
    ProgressService,
    GuiaService,
    MessageService
  ],
  bootstrap: [
    AppComponent
  ]
} )
export class AppModule { }
