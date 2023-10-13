import { Injectable } from '@angular/core';
import { BehaviorSubject  } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class ProgressService {
  private progressSubject = new BehaviorSubject< number >( 0 );
  progress$ = this.progressSubject.asObservable();

  constructor() {
    const storedProgress = localStorage.getItem( 'progress' );
    if ( storedProgress ) {
      this.progressSubject.next( parseInt( storedProgress, 10 ) );
    }
  }

  updateProgress( progress: number ) {
    this.progressSubject.next( progress );
    localStorage.setItem( 'progress', progress.toString() );
  }
}
