import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-icmbio',
  templateUrl: './icmbio.page.html',
  styleUrls: ['./icmbio.page.scss'],
})
export class IcmbioPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  abrirLogin(){
    this.router.navigateByUrl(`/login`)
  }

}
