import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { FcmService } from './services/fcm.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public userId = null
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcmService: FcmService,
    private router: Router,
    private toastCtrl: ToastController,
  ) {
    this.initializeApp();
  }

   initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //Push Notification
      //  Pegar o Token
      this.fcmService.getToken()

      //  Ouvir as Notificações
      this.fcmService.listenToNotifications().pipe(
          tap(async msg => {
            // mostra o toast
            const toast = await this.toastCtrl.create({
              message: msg.body,
              duration: 3000
            })
            toast.present()
          })
      ).subscribe()
    });
  }


}
