import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumsComponent } from './components/albums/albums.component';
import { AuthGuard } from './components/auth/auth.guard';
import { LoggedGuard } from './components/auth/logged.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CatalogoFotoComponent } from './components/catalogo-foto/catalogo-foto.component';
import { FotosComponent } from './components/fotos/fotos.component';
import { GestioneFotoComponent } from './components/gestione-foto/gestione-foto.component';
import { GestionePostComponent } from './components/gestione-post/gestione-post.component';
import { HomeComponent } from './components/home/home.component';
import { PostsComponent } from './components/posts/posts.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'posts',
    component: PostsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'post',
    component: GestionePostComponent,
    canActivate: [AuthGuard]
  },
  {
      path: 'login',
      component: LoginComponent,
      canActivate: [LoggedGuard]
  },
  {
      path: 'register',
      component: RegisterComponent,
      canActivate: [LoggedGuard]
  },
  {
    path:'albums',
    component: CatalogoFotoComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'fotos/:id',
        component: FotosComponent
      },
      {
        path: '',
        component: AlbumsComponent
      },
      {
        path: 'gestioneFoto/:id',
        component: GestioneFotoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
