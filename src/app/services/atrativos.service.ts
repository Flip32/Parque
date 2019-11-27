import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import actions from '@angular/fire/schematics/deploy/actions';

@Injectable({
  providedIn: 'root'
})
export class AtrativosService {

  public piscinas: Observable<any>
  public piscinasCollection: AngularFirestoreCollection<any>
  public alternativos: Observable<any>
  public alternativosCollection: AngularFirestoreCollection<any>

  constructor(private afs: AngularFirestore) {
    this.piscinasCollection = this.afs.collection('piscinas', ref => ref.orderBy('nome'))
    this.piscinas = this.piscinasCollection.snapshotChanges().pipe(
        map( actions => {
          return actions.map( a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
          })
        })
    )
    this.alternativosCollection = this.afs.collection('alternativos', ref => ref.orderBy('nome'))
    this.alternativos = this.alternativosCollection.snapshotChanges().pipe(
        map( actions => {
          return actions.map( a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
          })
        })
    )
  }

  getPiscinas() {
    return this.piscinas
  }

  getAlternativos() {
    return this.alternativos
  }


}
