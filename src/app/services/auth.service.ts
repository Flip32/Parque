import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { auth } from 'firebase/app';
import { LoadingController, Platform } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { User } from '../shared/User.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<User>

  constructor(
      public afAuth: AngularFireAuth,
      private afs: AngularFirestore,
      private router: Router,
      private gplus: GooglePlus,
      private platform: Platform,
      private loadingController: LoadingController
  ) {
    this.user$ = this.afAuth.authState.pipe(
        switchMap (user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
    )
  }

  async googleSigninCordova() {
    const loading = await this.loadingController.create({
      message: 'Aguarde...'
    });
    this.presentLoading(loading);
    if (!this.platform.is('cordova')) {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      loading.dismiss();
      return this.updateUserData(credential.user)
    } else {
      const user = await this.gplus.login({
        webClientId: environment.googleWebClientId,
        offline: true,
        scopes: 'profile email'
      });
      const credential = await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(user.idToken));
      loading.dismiss();
      return this.updateUserData(credential.user)
    }
  }



  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }

  public updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email,
      admim: false,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    return userRef.set(data, { merge: true });
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
