import { Component, OnInit } from '@angular/core';
import { EventosService } from '../services/eventos.service';
import { Evento } from '../shared/eventos.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {LoadingController, Platform, ToastController} from '@ionic/angular';
import { Avisos } from '../shared/avisos.model';
import { AvisosService} from '../services/avisos.service';
import { FirebaseService } from '../services/firebase.service';
import { Ocorrencia } from '../shared/banco.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage}  from '@angular/fire/storage';
import { File } from '@ionic-native/file/ngx';
import {User} from '../shared/User.model';
import {UsuariosService} from '../services/usuarios.service';

@Component({
  selector: 'app-validacao',
  templateUrl: './validacao.page.html',
  styleUrls: ['./validacao.page.scss'],
  providers: [EventosService, FirebaseService, AvisosService, UsuariosService]
})
export class ValidacaoPage implements OnInit {



    public evento: Evento = {
    titulo: '',
    descricao: '',
    url: '',
    dataI: null,
    dataF: null
    };

    public aviso: Avisos = {
    titulo: '',
    conteudo: '',
    data: null
    }

    public idAviso = null
    public idOcorrenciaVal = null

    public id = null
    private eventos: Observable<Evento[]>
    private ocorrenciasAdd: Observable<Ocorrencia[]>;
    public usuarios: User[]

    public validacao: boolean = false;
    public verFormEventos: boolean = false;
    public verFormAvisos: boolean = false;
    public verAdmim = false;

    public nomeImagem: string;
    public blob: Blob;
    public downloadUri: Observable<string>;
    public urlTransition: string;
    public formularioPreenchidoEventos: boolean = false;

    constructor( private activatedRoute: ActivatedRoute, private eventosService: EventosService,
               private router: Router, private toastCtrl: ToastController,
               private avisosService: AvisosService, private firebaseService: FirebaseService,
               private platform: Platform, private file: File, private afStorage: AngularFireStorage,
               private camera: Camera, private usuariosService: UsuariosService, private loadingController: LoadingController) { }

    ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    this.eventos = this.eventosService.getEventos()
    this.idOcorrenciaVal = this.activatedRoute.snapshot.paramMap.get('id')
    this.ocorrenciasAdd = this.firebaseService.getOcorrencias();
    this.usuariosService.getUsers().subscribe(data => this.usuarios = data)
    }

    ionViewWillEnter() {
    if (this.id) {
      this.eventosService.getEvento(this.id).subscribe(evento => {
        this.evento = evento;
      });
    }
    if (this.idAviso){
      this.avisosService.getAviso(this.idAviso).subscribe(aviso => {
        this.aviso = aviso
      })
    }
    }


    async adicionarEvento(){
        const loading = await this.loadingController.create({
            message: 'Enviando Evento..'
        });
        this.presentLoading(loading)
        this.evento.url = this.urlTransition;
        await this.eventosService.addEvento(this.evento).then(() =>{
            loading.dismiss();
            this.showToast('Seu Evento foi enviado com sucesso!')
        }, err => {
            this.eventosService.deleteEvento(this.evento.id)
            loading.dismiss();
            this.showToast('Houve um erro ao enviar o evento :(')
        }).finally(
            () => setInterval(
                () => {
                    window.location.reload()
                }, 900
            )
        )
    }

    async adicionarAviso(){
        const loading = await this.loadingController.create({
            message: 'Enviando Aviso..'
        });
        this.presentLoading(loading)
        this.aviso.data = Date.now();
        await this.avisosService.addAviso(this.aviso).then(
            () => {
                loading.dismiss();
                this.showToast('Seu Aviso foi criado com sucesso!')
            }, err => {
                this.avisosService.deleteAviso(this.aviso.id)
                loading.dismiss();
                this.showToast('Houve um erro ao criar seu Aviso')
            }).finally(
            () => setInterval(
                () => {
                    window.location.reload()
                }, 900
            )
        )
    }

    showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 1500
    }).then(toast => toast.present());
    }

    abrirValidacao(){
    this.validacao = !this.validacao
    }

    abrirFormularioEventos(){
    this.verFormEventos = !this.verFormEventos
    }

    abrirFormularioAvisos(){
    this.verFormAvisos = !this.verFormAvisos
    }

    abrirAdministradores(){
      this.verAdmim = !this.verAdmim
    }

    validarOcorrencia(id){
    this.firebaseService.validaOcorrencia(id)
    this.showToast('Ocorrência Validada!')

    }

    async deletarVal(id, ref){
        await this.firebaseService.deleteOcorrencia(id);
        await this.firebaseService.deleteImagem(ref);
        this.showToast('Sua Ocorrência não foi Validada.')
    }

    /* Camera  */
    async imagemEventoAdd() {

    if(this.nomeImagem == undefined){
        this.nomeImagem = this.evento.titulo;
        if(this.nomeImagem == undefined){
            this.showToast('Preencha os campos abaixo primeiro')
        }
    } else {

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

        this.nomeImagem = this.evento.titulo;
        this.uploadImagem(this.blob);

    }
    }

    uploadImagem(blob: Blob){
    const ref = this.afStorage.ref(this.nomeImagem);
    const task = ref.put(blob);

    task.snapshotChanges().pipe(
        finalize(() =>{  this.downloadUri = ref.getDownloadURL(); this.mostraDetalhesImg()})
    ).subscribe()

    this.showToast('Sua Imagem está sendo enviada, aguarde.');
    }

    mostraDetalhesImg(){
    this.downloadUri.subscribe(url => this.urlTransition = url )
    this.showToast(`Sua Imagem foi enviada com Sucesso!`)
    this.formularioPreenchidoEventos = !this.formularioPreenchidoEventos;
    }

    async salvarAdmim() {
        const loading = await this.loadingController.create({
            message: 'Salvando Usuarios..'
        });
        this.presentLoading(loading)
        for (let usuario of this.usuarios) {
         await this.usuariosService.salvarUsuarioAdmim(usuario.uid, usuario)
        }
        loading.dismiss();
        this.showToast('Usuários atualizados')
    }

    async presentLoading(loading) {
        return await loading.present();
    }





}
