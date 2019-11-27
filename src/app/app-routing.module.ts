import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'atracoes', loadChildren: './atracoes/atracoes.module#AtracoesPageModule', canActivate: [AuthGuard] },
  { path: 'ocorrencias', loadChildren: './ocorrencias/ocorrencias.module#OcorrenciasPageModule', canActivate: [AuthGuard] },
  { path: 'trilhas', loadChildren: './trilhas/trilhas.module#TrilhasPageModule', canActivate: [AuthGuard] },
  { path: 'icmbio', loadChildren: './icmbio/icmbio.module#IcmbioPageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule'},
  { path: 'emergencia', loadChildren: './emergencia/emergencia.module#EmergenciaPageModule', canActivate: [AuthGuard] },
  { path: 'avisos', loadChildren: './avisos/avisos.module#AvisosPageModule', canActivate: [AuthGuard] },
  { path: 'validacao', loadChildren: './validacao/validacao.module#ValidacaoPageModule', canActivate: [AuthGuard] },
  { path: 'sobre', loadChildren: './sobre/sobre.module#SobrePageModule', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
