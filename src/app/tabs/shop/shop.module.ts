import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopPage } from './shop.page';

import { ShopPageRoutingModule } from './shop-routing.module';

@NgModule({
    imports: [IonicModule, CommonModule, FormsModule, ShopPageRoutingModule],
    declarations: [ShopPage]
})
export class ShopPageModule {}
