import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-emergencia',
  templateUrl: './emergencia.page.html',
  styleUrls: ['./emergencia.page.scss'],
})
export class EmergenciaPage implements OnInit {

  public contacts = [
    {
      name: 'POLÍCIA - 190',
      phone: 190
    },
    {
      name: 'SAMU - 192',
      phone: 192
    },
    {
      name: 'BOMBEIROS - 193',
      phone: 193
    }
  ]
  constructor(private callNumber: CallNumber) { }

  ngOnInit() {
  }


  call(phone) {
    this.callNumber.callNumber(phone, true)
        .then(res => console.log('Ligação feita.', res))
        .catch(err => console.log('Erro ao fazer ligação.', err))
  }



}
