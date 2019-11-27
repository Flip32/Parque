import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import * as admin from 'firebase-admin';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(public fcm: FCM,
              public afs: AngularFirestore,
              private platform: Platform) {}


  //Pegar a permissao do usuário
  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.fcm.getToken();

    }

    if (this.platform.is('ios')) {
      token = await this.fcm.getToken();
      // await this.fcm.grantPermission();
    }

    return this.saveTokenToFirestore(token);
  }

  // Salvar o token no firestore
  private saveTokenToFirestore(token) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices');

    const docData = {
      token
    }

    return devicesRef.doc(token).set(docData)

  }

  // Ouvir notificações
  listenToNotifications() {
    return this.fcm.onNotification()
  }



}
