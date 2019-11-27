import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { environment } from '../environments/environment';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { FcmService } from './services/fcm.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { firebaseui, firebase, FirebaseUIModule } from 'firebaseui-angular';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
  //tosUrl: '/terms',
  //privacyPolicyUrl: '/privacy',
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
};


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
            AngularFireModule.initializeApp(environment.firebaseConfig),
            AngularFirestoreModule, AngularFireStorageModule, AngularFireAuthModule,
            FirebaseUIModule.forRoot(firebaseUiAuthConfig)],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {}},
      Camera, File, GooglePlus, FCM, CallNumber, FcmService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
