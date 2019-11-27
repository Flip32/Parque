import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap} from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private toastCtrl: ToastController) {}

  canActivate(next, state): Observable<boolean>{
    return this.auth.user$.pipe(
        take(1),
        map(user => !!user),
        tap(loggedIn => {
          if (!loggedIn) {
            this.showToast('Acesso Negado!')
            this.router.navigate(['/'])
          }
        })
    );
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 1500
    }).then(toast => toast.present());
  }
}
