import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./tabs/tabs.module').then((m) => m.TabsPageModule)
    },
    {
        path: 'login',
        canActivate: [NoAuthGuard],
        loadChildren: () =>
            import('./login/login.module').then((m) => m.LoginPageModule)
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
