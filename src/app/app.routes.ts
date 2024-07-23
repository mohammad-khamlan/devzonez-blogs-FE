import { Routes } from '@angular/router';
import { AuthResolver } from '../authentication/auth.resolver';
import { AuthGuard } from '../authentication/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: '/auth/sign-in', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('../authentication/authentication.module').then(m => m.AuthenticationModule) },
    { path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard], resolve: { auth: AuthResolver } }
];

export const APP_ROUTES = routes;
