import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopPage } from './shop.page';

import { ShopPageRoutingModule } from './shop-routing.module';
import { ShopCategoryComponent } from './shop-category/shop-category.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ShopPageRoutingModule,
        ComponentsModule
    ],
    declarations: [ShopPage, ShopCategoryComponent]
})
export class ShopPageModule {}
