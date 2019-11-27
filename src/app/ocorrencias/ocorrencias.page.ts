import { Component, OnInit } from '@angular/core';
import { Ocorrencia } from '../shared/banco.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import {LoadingController, Platform, ToastController} from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { User } from '../shared/User.model';
import { AuthService } from '../services/auth.service';
import { UidAdim } from '../shared/admim';

@Component({
  selector: 'app-ocorrencias',
  templateUrl: './ocorrencias.page.html',
  styleUrls: ['./ocorrencias.page.scss'],
  providers: [FirebaseService]
})
export class OcorrenciasPage implements OnInit {
  mostraCardLost = false;
  mostraCardSelvagem = false;
  mostraCardEspecies = false;
  mostraCardCrimes = false;
  mostraCardEstrutura = false;
  addOcorrencia = false;

  public ocorrencia: Ocorrencia = {
   tipo: undefined,
   nomeOcorrencia: undefined,
   local: undefined,
   data: null,
    url: '',
    user: null,
    validado: false
  };

  public userUid = null


  private ocorrenciaAnimalPerdido: Observable<Ocorrencia[]>
  private ocorrenciaFauna: Observable<Ocorrencia[]>
  private ocorrenciaFlora: Observable<Ocorrencia[]>
  private ocorrenciaCrimes: Observable<Ocorrencia[]>
  private ocorrenciaEstrutura: Observable<Ocorrencia[]>
  public downloadUri: Observable<string>;
  public urlTransition: string;
  public blob: Blob;
  public nomeImagem: string = undefined;

  public user: User = null;
  public admim = false

  public id = null;

  public formularioPreenchido: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private firebaseService: FirebaseService,
              private router: Router,
              private toastCtrl: ToastController,
              private camera: Camera,
              private platform: Platform,
              private file: File,
              private afStorage: AngularFireStorage,
              public auth: AuthService,
              private loadingCtrl: LoadingController
              ) { }


  ngOnInit() {
    this.auth.user$.subscribe( user => {
      this.user = user
      this.admim = user.admim
      this.userUid = user.uid
    })
    //this.auth.user$.subscribe(({uid}) => this.userUid = uid)
  }




  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 1800
    }).then(toast => toast.present());
  }



  verLost() {
    this.mostraCardLost = !this.mostraCardLost;
    this.ocorrenciaAnimalPerdido = this.firebaseService.getOcorrenciasPorTipoAnimaisPerdidos();
  }
  verSelvagem() {
    this.mostraCardSelvagem = !this.mostraCardSelvagem;
    this.ocorrenciaFauna = this.firebaseService.getOcorrenciasPorTipoFauna();
  }
  verEspecies() {
    this.mostraCardEspecies = !this.mostraCardEspecies;
    this.ocorrenciaFlora = this.firebaseService.getOcorrenciasPorTipoFlora();
  }
  verCrimes() {
    this.mostraCardCrimes = !this.mostraCardCrimes;
    this.ocorrenciaCrimes = this.firebaseService.getOcorrenciasPorTipoCrimes();
  }
  verEstrutura() {
    this.mostraCardEstrutura = !this.mostraCardEstrutura;
    this.ocorrenciaEstrutura = this.firebaseService.getOcorrenciasPorTipoEstrutura();
  }
  addOcorrencias() {
    this.addOcorrencia = !this.addOcorrencia;
  }

  /* Camera  */
  async abrirCamera() {

    this.nomeImagem = this.ocorrencia.nomeOcorrencia;

    if(this.nomeImagem === undefined || this.nomeImagem === '' || this.ocorrencia.tipo === undefined || this.ocorrencia.tipo === '' || this.ocorrencia.local === undefined || this.ocorrencia.local === '') {
        this.showToast('Preencha os campos abaixo primeiro')
        return

    } else if (this.nomeImagem != undefined && this.nomeImagem !== '' && this.ocorrencia.tipo != undefined && this.ocorrencia.tipo !== '' && this.ocorrencia.local != undefined && this.ocorrencia.local !== ''){
      if (this.platform.is('desktop')){
        this.showToast('Ainda não é possível adicionar ocorrências pelo PC.')
        return
      }
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true
      };

      try {
        const fileUri: string = await this.camera.getPicture(options);
        let file: string;

        if(this.platform.is('ios')) {
          file = fileUri.split('/').pop();
        } else {
          file = fileUri.substring(fileUri.lastIndexOf('/') +1, fileUri.indexOf('?'));
        }

        const path: string = fileUri.substring(0, fileUri.lastIndexOf('/'));
        const buffer: ArrayBuffer = await  this.file.readAsArrayBuffer(path, file);
        const blob: Blob = new Blob([buffer], { type: 'image/jpeg'});

        this.blob = blob

      }catch (error) {
        console.log(error)
      }

      this.nomeImagem = this.ocorrencia.nomeOcorrencia;
      //this.uploadImagem(this.blob);
      this.formularioPreenchido = !this.formularioPreenchido;

    }
  }

  async adicionarOcorrencia() {
    if(confirm('Deseja Enviar sua Ocorrência?')) {
      const loading = await this.loadingCtrl.create({
        message: 'Enviando Ocorrência, aguarde..'
      });
      this.presentLoading(loading)
      await this.uploadImagem()
      // this.showToast(`Sua Ocorrência está sendo enviada, Aguarde!`)
    } else return
  }

  uploadImagem(){
    const ref = this.afStorage.ref(this.nomeImagem);
    const task = ref.put(this.blob);

    task.snapshotChanges().pipe(
       finalize(() =>{  this.downloadUri = ref.getDownloadURL(); this.mostraDetalhesImg()})
   ).subscribe()
  }

   mostraDetalhesImg(){
     this.downloadUri.subscribe(
        url => {this.urlTransition = url},
        () => {
          this.loadingCtrl.dismiss()
          this.showToast('Deu erro!')
          this.firebaseService.deleteImagem(this.ocorrencia.nomeOcorrencia)
        },
        () => {
          this.enviarOcorrencia()
          this.loadingCtrl.dismiss()
        }
        )
  }

  enviarOcorrencia(){
    this.ocorrencia.user = this.user
    this.ocorrencia.url = this.urlTransition
    this.ocorrencia.data = Date.now()
    this.firebaseService.addOcorrencia(this.ocorrencia).then(() => {
      this.router.navigateByUrl('/home');
      this.showToast('Sua ocorrência foi enviada com sucesso para análise!')
    }, err => {
      this.showToast('Houve um erro ao enviar a ocorrência :(')
    })
  }

  async deleteOC(id, ref){
    if (window.confirm('Ao deletar não poderá ser recuperado, prosseguir?')) {
      await this.firebaseService.deleteOcorrencia(id);
      await this.firebaseService.deleteImagem(ref);
      this.showToast('Ocorrência Deletada com Sucesso!');
    }

  }

  exibirParaAdim(): boolean {
    if (UidAdim === this.userUid || this.admim === true) {
      return true
    }
  }

  async presentLoading(loading) {
    return await loading.present();
  }



}
