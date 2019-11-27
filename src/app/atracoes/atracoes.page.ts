import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Evento} from '../shared/eventos.model';
import {EventosService} from '../services/eventos.service';
import {ActivatedRoute} from '@angular/router';
import {UidAdim} from '../shared/admim';
import {AuthService} from '../services/auth.service';
import {AngularFireStorage} from '@angular/fire/storage';
import * as firebase from 'firebase';
import {AtrativosService} from '../services/atrativos.service';

@Component({
  selector: 'app-atracoes',
  templateUrl: './atracoes.page.html',
  styleUrls: ['./atracoes.page.scss'],
  providers: [AtrativosService, EventosService, AuthService]
})
export class AtracoesPage implements OnInit {

  mostra = '';
  mostraPiscinas = false;
  mostraEventos = false;

  public userUid = null
  public admim = false
  public piscinas
  public alternativos

  public evento: Evento = {
    titulo: '',
    descricao: '',
    url: '',
    dataI: null,
    dataF: null
  };


  public id = null
  private eventos: Observable<Evento[]>

  constructor( private activatedRoute: ActivatedRoute, private eventosService: EventosService,
               private auth: AuthService, private afStorage: AngularFireStorage, private atrativosService: AtrativosService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    this.auth.user$.subscribe(user => {
      this.userUid = user.uid
      this.admim = user.admim
    })
    this.eventos = this.eventosService.getEventos()
    this.piscinas = this.atrativosService.getPiscinas()
    this.alternativos = this.atrativosService.getAlternativos()
  }

  ionViewWillEnter(){
    if(this.id) {
      this.eventosService.getEvento(this.id).subscribe(evento => {
        this.evento = evento
      })
    }
  }



  mostraPiscinasF() {
    this.mostraPiscinas = !this.mostraPiscinas
  }

  mostraEventosF() {
    this.mostraEventos = !this.mostraEventos
  }

  mostraAlternativo(id) {
    if (this.mostra === id) {
      this.mostra = ''
    } else this.mostra = id
  }



  async deletaEvento(id){
    if (confirm('Ao deletar não poderá ser recuperado, prosseguir?')) {
      await this.eventosService.deleteEvento(id)
    }
  }

  exibirParaAdim(): boolean {
    if (UidAdim === this.userUid || this.admim === true) {
      return true
    }
  }

  /*verRef(){
    console.log(firebase.storage().refFromURL('gs://parquenacional-63888.appspot.com/Estáticas/Piscina_pedreira.jpg'))

  }*/

}

