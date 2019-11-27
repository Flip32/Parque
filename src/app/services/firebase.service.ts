import { Injectable } from '@angular/core';
import { Ocorrencia} from '../shared/banco.model';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public tipo = '';
  private ocorrencias: Observable<Ocorrencia[]>;
  private ocorrenciaCollection: AngularFirestoreCollection<Ocorrencia>;


  constructor(private afs: AngularFirestore, private afStorage: AngularFireStorage) {

    this. ocorrenciaCollection = this.afs.collection<Ocorrencia>('ocorrenciasValidar', ref => {
            return ref.where('validado', '==', false)});
    this.ocorrencias = this.ocorrenciaCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
          })
        }));

  }


    getOcorrenciasPorTipoAnimaisPerdidos(): Observable<Ocorrencia[]>{
        this. ocorrenciaCollection = this.afs.collection<Ocorrencia>('ocorrenciasValidar', ref => ref.where('tipo', '==', 'Animal Perdido')
            .where('validado', '==', true).orderBy('data', 'desc'));
        this.ocorrencias = this.ocorrenciaCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data}
                })
            }));

        return this.ocorrencias;
    }

    getOcorrenciasPorTipoFauna(): Observable<Ocorrencia[]>{
        this. ocorrenciaCollection = this.afs.collection<Ocorrencia>('ocorrenciasValidar', ref => ref.where('tipo', '==', 'Fauna Silvestre')
            .where('validado', '==', true).orderBy('data', 'desc'));
        this.ocorrencias = this.ocorrenciaCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data}
                })
            }));

        return this.ocorrencias;
    }

    getOcorrenciasPorTipoFlora(): Observable<Ocorrencia[]>{
        this. ocorrenciaCollection = this.afs.collection<Ocorrencia>('ocorrenciasValidar', ref => ref.where('tipo', '==', `Flora Silvestre`)
            .where('validado', '==', true).orderBy('data', 'desc'));
        this.ocorrencias = this.ocorrenciaCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data}
                })
            }));

        return this.ocorrencias;
    }

    getOcorrenciasPorTipoCrimes(): Observable<Ocorrencia[]>{
        this. ocorrenciaCollection = this.afs.collection<Ocorrencia>('ocorrenciasValidar', ref => ref.where('tipo', '==', `Crimes Ambientais`)
            .where('validado', '==', true).orderBy('data', 'desc'));
        this.ocorrencias = this.ocorrenciaCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data}
                })
            }));

        return this.ocorrencias;
    }

    getOcorrenciasPorTipoEstrutura(): Observable<Ocorrencia[]>{
        this. ocorrenciaCollection = this.afs.collection<Ocorrencia>('ocorrenciasValidar', ref => ref.where('tipo', '==', `Estrutura do Parque`)
            .where('validado', '==', true).orderBy('data', 'desc'));
        this.ocorrencias = this.ocorrenciaCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data}
                })
            }));

        return this.ocorrencias;
    }




    getOcorrencias(): Observable<Ocorrencia[]>{
        return this.ocorrencias
    }


    // getOcorrencia(id: string): Observable<Ocorrencia>{
    //     return this.ocorrenciaCollection.doc<Ocorrencia>(id).valueChanges().pipe(
    //         take(1),
    //         map(ocorrencia => {
    //             ocorrencia.id = id;
    //             return ocorrencia
    //         })
    //     )
    // }


    addOcorrencia(form: Ocorrencia): Promise<DocumentReference>{
        return this.ocorrenciaCollection.add(form);
    }

    validaOcorrencia(id) {
      this.ocorrenciaCollection.doc(id).update({
          validado: true
      })
    }

    deleteOcorrencia(id: string): Promise<void>{
        return this.ocorrenciaCollection.doc(id).delete()
    }

    deleteImagem(ref) {
      return this.afStorage.ref(ref).delete()
    }



}
