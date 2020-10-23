import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('./home/home.module').then((m) => m.HomePageModule)
            },
            {
                path: 'shop',
                loadChildren: () =>
                    import('./shop/shop.module').then((m) => m.ShopPageModule)
            },
            {
                path: 'lists',
                loadChildren: () =>
                    import('./lists/lists.module').then(
                        (m) => m.ListsPageModule
                    )
            },
            {
                path: 'categories',
                loadChildren: () =>
                    import('./categories/categories.module').then(
                        (m) => m.CategoriesPageModule
                    )
            },
            {
                path: '',
                redirectTo: '/tabs/home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {}
