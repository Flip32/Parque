import { Component, OnInit } from '@angular/core';
import {TrilhasService} from '../services/trilhas.service';

@Component({
  selector: 'app-trilhas',
  templateUrl: './trilhas.page.html',
  styleUrls: ['./trilhas.page.scss'],
  providers: [TrilhasService]
})
export class TrilhasPage implements OnInit {

  mostrar = null;
  public trilhas
  // private capivaraId = 'Zcdqs4mTXpM1Mx2bqijv'
  // private cristalId = 'OzeVBJQWMEsb1CLhVGOF'
  // private uniaoId = 'V6GGVDLyWuqwbYz9VUYT'

  constructor(private trilhasService: TrilhasService) { }

  ngOnInit() {
    this.getTrilhas()
  }

  mostrarCard(id) {
    if (this.mostrar === id) {
      this.mostrar = ''
    } else this.mostrar = id
  }



  getTrilhas() {
   this.trilhas = this.trilhasService.getTrilhas()
  }

}
