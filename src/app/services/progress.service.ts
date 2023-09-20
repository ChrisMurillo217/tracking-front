import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progressSubject = new Subject<number>();
  progress$ = this.progressSubject.asObservable();

  updateProgress( progress: number ) {
    this.progressSubject.next( progress );
  }
}
