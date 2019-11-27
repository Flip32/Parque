import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrilhasService {

  public trilhas: Observable<any>
  public trilhasCollection: AngularFirestoreCollection<any>

  constructor(private afs: AngularFirestore) {

    this.trilhasCollection = this.afs.collection('trilhas', ref => ref.orderBy('nome'))
    this.trilhas = this.trilhasCollection.snapshotChanges().pipe(
        map( actions => {
          return actions.map( a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
          })
        })
    )
  }

  getTrilhas() {
    return this.trilhas
  }

}
