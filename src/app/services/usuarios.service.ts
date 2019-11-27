import { Injectable } from '@angular/core';
import {User} from '../shared/User.model';
import {Observable} from 'rxjs';
import {Ocorrencia} from '../shared/banco.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {


  public users: Observable<User[]>;
  public userCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {

    this.userCollection = this.afs.collection<User>('users', ref => ref.orderBy('displayName'));
    this.users = this.userCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
          })
        })
    )
  }

  getUsers(): Observable<User[]> {
    return this.users
  }

  salvarUsuarioAdmim(uid, usuario){
    return this.userCollection.doc(uid).update(usuario)
  }

}
