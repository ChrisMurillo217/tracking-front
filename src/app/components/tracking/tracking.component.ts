import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { __param } from 'tslib';
import { catchError, forkJoin, tap, of } from 'rxjs';
import { ProgressBar } from 'primeng/progressbar';
import { ProgressService } from 'src/app/services/progress.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { OfService } from 'src/app/services/of.service';
import { GuiaService } from 'src/app/services/guia.service';
import { PedidoList } from '../../models/pedido.model';

@Component( {
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: [ './tracking.component.css' ]
} )
export class TrackingComponent implements OnInit {
  pedido:                 PedidoList | any;
  progress:               number = 0;
  numeroItem:             number = 0;
  pedidoCliente:          any = '';
  estadoPedido:           string = '';
  fechaContabilizacion:   string = '';
  fechaEntrega:           string = '';
  tiempoEntrega:          string = '';
  valorProgressBar:       number = 0;
  itemCode:               string[] = [];
  codigoItem:             string = '';
  guiasCant:              any[] = [];
  cantTotal:              number = 0;
  index:                  number = 0;
  mostrarSpinner:         boolean = true;

  constructor(
    private route             : ActivatedRoute,
    private progressService   : ProgressService,
    private pedidoService     : PedidoService,
    private guiaService       : GuiaService,
    private ofService         : OfService
  ) {}

  @ViewChild( 'myProgressBar', { static: false } ) myProgressBar: ProgressBar | null = null;

  ngOnInit(): void {
    const storedProgress = localStorage.getItem( 'progress' );
    if ( storedProgress ) {
      this.progress = parseInt( storedProgress, 10 );
    }
    this.route.paramMap.subscribe( ( params ) => {
      this.pedidoCliente = params.get( 'pedidoCliente' );
    } );

    this.pedidoService.getPedidoByDocNum( this.pedidoCliente ).subscribe(
      ( pedido ) => {
        this.pedido = pedido;
        this.estadoPedido = this.pedido[ 0 ].estadoPedido;
        this.fechaContabilizacion = this.formatDate( this.pedido[ 0 ].fechaContabilizacion );
        this.fechaEntrega = this.formatDate( this.pedido[ 0 ].fechaEntrega );
        this.tiempoEntrega = this.calcularTiempoEntrega(
          this.pedido[ 0 ].fechaContabilizacion,
          this.pedido[ 0 ].fechaEntrega
        );

        this.pedidoService.getPedidosByDocNum( this.pedidoCliente ).subscribe(
          ( items ) => {
            this.numeroItem = items.length;
            this.itemCode = items;

            this.obtenerGuiasParaItems(items);
          },
          ( error ) => {
            console.error( error );
          }
        )
      },
      ( error ) => {
        console.error( error );
      }
    );

    this.progressService.progress$.subscribe( ( progress ) => {
      this.progress = parseFloat( progress.toFixed( 2 ) );
      this.valorProgressBar = this.progress;
    } );
  }

  obtenerGuiasParaItems( items: string[] ): void {
    this.guiasCant = [];

    const observables = items.map( ( item ) => {
      return forkJoin( [
        this.guiaService.getGuia( item, this.pedidoCliente ),
        this.ofService.getOf( this.pedidoCliente )
      ] ).pipe(
        tap( ( [ guias, OFs ] ) => {
          if ( guias.length > 0 ) {
            const cantidadTotal = guias.reduce(
              ( total, guia ) => total + parseInt( guia.Quantity.toString(), 10 ),
              0
            );

            if ( !OFs ) {
              const progresoRestante = 100 - this.progress;
              const progresoProp = progresoRestante / this.numeroItem;

              this.progress += 2 * progresoProp;
              this.progress = parseFloat( this.progress.toFixed( 2 ) );
              this.valorProgressBar = this.progress;
            } else if ( OFs ) {
              const progresoRestante = 100 - this.progress;
              const progressProp = progresoRestante / this.numeroItem;

              this.progress += progressProp;
              this.progress = parseFloat( this.progress.toFixed( 2 ) );
              this.valorProgressBar = this.progress;
            }

            this.guiasCant.push( {
              itemCode: item,
              cantidadTotal: cantidadTotal
            } );

            if ( this.progress === 100 ) {
              this.mostrarSpinner = false;
            }
          }
        } ),
        catchError( ( error ) => {
          console.error( 'Error al obtener guías o la OF:', error );
          return of( null );
        } )
      )
    } );

    forkJoin( observables ).subscribe( () => {
      console.log('Todas las solicitudes completadas');
    } );
  }

  formatDate( dateString: string ): string {
    const date = new Date( dateString );
    const day = ( date.getDate() + 1 ).toString().padStart( 2, '0' );
    const month = ( date.getMonth() + 1 ).toString().padStart( 2, '0' );
    const year = date.getFullYear().toString();

    return `${ day }/${ month }/${ year }`;
  }

  calcularTiempoEntrega( fechaContabilizacion: Date, fechaFin: Date ): string {
    const fechaIngreso = new Date( fechaContabilizacion );
    const fechaEntrega = new Date( fechaFin );
    const tiempoMilisegundos = fechaEntrega.getTime() - fechaIngreso.getTime();
    const diasEntrega = tiempoMilisegundos / ( 1000 * 60 * 60 * 24 );
    return `${ Math.floor( diasEntrega ) } días`;
  }

  obtenerValorDeProgressBar() {
    const valorProgressBar = this.myProgressBar?.value;
    if ( valorProgressBar !== undefined ) {
      console.log( 'Valor de ProgressBar:', valorProgressBar );
    } else {
      console.log( 'La barra de progreso es nula o indefinida.' );
    }
  }
}
