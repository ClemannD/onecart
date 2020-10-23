import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesPage } from './categories.page';

import { CategoriesPageRoutingModule } from './categories-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { CategoryComponent } from './category/category.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ComponentsModule,

        CategoriesPageRoutingModule
    ],
    declarations: [CategoriesPage, CategoryComponent]
})
export class CategoriesPageModule {}
