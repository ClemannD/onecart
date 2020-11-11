import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { RegisterPageGuard } from './guards/register-page.guard';
import { HouseholdPageGuard } from './guards/household-page.guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./tabs/tabs.module').then((m) => m.TabsPageModule)
    },
    {
        path: 'login',
        canActivate: [NoAuthGuard],
        loadChildren: () =>
            import('./login/login.module').then((m) => m.LoginPageModule)
    },
    {
        path: 'register',
        canActivate: [RegisterPageGuard],
        loadChildren: () =>
            import('./register/register.module').then(
                (m) => m.RegisterPageModule
            )
    },
    {
        path: 'household',
        canActivate: [HouseholdPageGuard],
        loadChildren: () =>
            import('./household/household.module').then(
                (m) => m.HouseholdPageModule
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
