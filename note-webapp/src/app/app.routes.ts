import { Routes } from '@angular/router';
import { LoginComponent } from './pages/unauthorized/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NotAuthGuard } from './core/guards/notAuth.guard';
import { RegisterComponent } from './pages/unauthorized/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard] },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard], // Bảo vệ route
  },
  // {
  //   path: 'note/:id',
  //   component: NoteDetailComponent,
  //   canActivate: [AuthGuard], // Bảo vệ route
  // },
  { path: '**', redirectTo: 'home' },
];
