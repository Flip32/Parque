import { Component, OnInit } from '@angular/core';

import {Router} from '@angular/router';
import {Card} from '../shared/card.model';
import {CARDS} from './mock';
import {AuthService} from '../services/auth.service';
import { UidAdim } from '../shared/admim';
import {FirebaseService} from '../services/firebase.service';
import {Ocorrencia} from '../shared/banco.model';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [FirebaseService]
})
export class HomePage implements OnInit{
  public userUid = null
  public admim = false
  public cards: Card[] = CARDS;
  public outro: Array<number> = [0, 1, 2, 3, 4, 5];
  public card1: Card;
  public card2: Card;
  public card3: Card;
  public card4: Card;
  public card5: Card;
  public card6: Card;
  public contadorNoficacao = 0


  constructor(public router: Router, private auth: AuthService, private firebaseService: FirebaseService) {
    this.card1 = this.cards[this.outro[0]];
    this.card2 = this.cards[this.outro[1]];
    this.card3 = this.cards[this.outro[2]];
    this.card4 = this.cards[this.outro[3]];
    this.card5 = this.cards[this.outro[4]];
    this.card6 = this.cards[this.outro[5]];

    this.firebaseService.getOcorrencias().subscribe(data => this.contadorNoficacao = data.length)

  }

  ngOnInit() {
    this.auth.user$.subscribe( (data) => {
      this.userUid = data.uid
      this.admim = data.admim
    })

  }

  abrirValidacao(){
    this.router.navigateByUrl(`/validacao`)
  }

  exibirParaAdim(): boolean{
    if( UidAdim === this.userUid || this.admim === true){
      return true
    }
  }



}
