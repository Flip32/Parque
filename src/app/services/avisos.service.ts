import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Avisos} from '../shared/avisos.model';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AvisosService {

  private avisos: Observable<Avisos[]>
  private avisoCollection: AngularFirestoreCollection<Avisos>

  constructor( private afs: AngularFirestore) {
    this.avisoCollection = this.afs.collection<Avisos>('avisos', ref => ref.orderBy('data', 'desc'));
    this.avisos = this.avisoCollection.snapshotChanges().pipe(
        map( actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
          })
        })
    )
  }

  getAvisos(): Observable<Avisos[]> {
    return this.avisos
  }

  getAviso(id: string): Observable<Avisos> {
    return this.avisoCollection.doc<Avisos>(id).valueChanges().pipe(
        take(1),
        map( aviso => {
          aviso.id = id;
          return aviso
        })
    )
  }

  addAviso(formA: Avisos): Promise<DocumentReference> {
    return this.avisoCollection.add(formA)
  }

  deleteAviso(id: string): Promise<void> {
    return this.avisoCollection.doc(id).delete()
  }


}
