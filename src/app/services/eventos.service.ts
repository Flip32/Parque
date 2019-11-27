import { Injectable } from '@angular/core';
import { Evento } from '../shared/eventos.model';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private eventos: Observable<Evento[]>;
  private eventoCollection: AngularFirestoreCollection<Evento>

  constructor( private afs: AngularFirestore) {
    this. eventoCollection = this.afs.collection<Evento>('eventos', ref => ref.orderBy('dataI', 'asc'));
    this.eventos = this.eventoCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
          })
        }));
  }

  getEventos(): Observable<Evento[]> {
    return this.eventos
  }

  getEvento(id: string): Observable<Evento> {
    return this.eventoCollection.doc<Evento>(id).valueChanges().pipe(
    take(1),
        map( evento => {
          evento.id = id;
          return evento
        }))
  }

  addEvento(formE: Evento): Promise<DocumentReference> {
    return this.eventoCollection.add(formE);
  }

  deleteEvento(id: string): Promise<void> {
    return this.eventoCollection.doc(id).delete()
  }


}
