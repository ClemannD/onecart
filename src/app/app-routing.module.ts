import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import {
    AngularFireAuthGuard,
    hasCustomClaim,
    redirectUnauthorizedTo,
    redirectLoggedInTo,
    canActivate
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['/tabs/home']);

const routes: Routes = [
    {
        path: '',
        ...canActivate(redirectUnauthorizedToLogin),
        loadChildren: () =>
            import('./tabs/tabs.module').then((m) => m.TabsPageModule)
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./login/login.module').then((m) => m.LoginPageModule)
    },
    {
        path: 'register',
        ...canActivate(redirectUnauthorizedToLogin),
        loadChildren: () =>
            import('./register/register.module').then(
                (m) => m.RegisterPageModule
            )
    }
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
            anchorScrolling: 'enabled'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
