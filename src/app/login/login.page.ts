import { Component, OnInit } from '@angular/core';
import  { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {tap} from 'rxjs/operators';
import {pipe} from 'rxjs';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public user
    public emailVerificado = false
    public mostraLogComEmail = false


  constructor(public router: Router, private auth: AuthService, private toast: ToastController)
  {
      this.auth.afAuth.authState.subscribe(
          user => {
              this.user = user
              if(user) {
                  this.emailVerificado = this.auth.afAuth.auth.currentUser.emailVerified
              }
          }
      )
  }

  ngOnInit() {
   /*if (this.auth.user$){
     this.auth.user$.subscribe(data => console.log('usuario:', data))
     // this.router.navigateByUrl('/home')
   }*/
  }

    async enviarEmailConfirmacao() {
        let user
        await this.auth.afAuth.user.subscribe(data => user = data)
        this.auth.afAuth.auth.currentUser.sendEmailVerification()
        this.auth.updateUserData(user)
        this.showToast('Um email de verificação foi enviado.')
        this.verificaValidacao()
    }

    showToast(msg) {
        this.toast.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present())
    }

    verificaValidacao(){
        setInterval(() => {
            window.location.reload()
        }, 60000)
    }

    refresh(){
        window.location.reload()
    }

    mostrarLogComEmail() {
        this.mostraLogComEmail = !this.mostraLogComEmail
    }


}
