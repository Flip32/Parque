import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Avisos } from '../shared/avisos.model';
import { AvisosService } from '../services/avisos.service';
import { ActivatedRoute } from '@angular/router';
import {UidAdim} from '../shared/admim';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.page.html',
  styleUrls: ['./avisos.page.scss'],
})
export class AvisosPage implements OnInit {

  public id = null
  private avisos: Observable<Avisos[]>
  public admim = false
  public userUid

  constructor(private activatedRoute: ActivatedRoute, private avisosService: AvisosService, private auth: AuthService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.avisos = this.avisosService.getAvisos()
    this.auth.user$.subscribe( user => {
      this.admim = user.admim
      this.userUid = user.uid
    })
  }

  exibirParaAdim(): boolean {
    if (UidAdim === this.userUid || this.admim === true) {
      return true
    }
  }

  async deleteAviso(id) {
    if(confirm('Ao deletar não poderá ser recuperado, prosseguir?')) {
      await this.avisosService.deleteAviso(id)
    }
  }

}
