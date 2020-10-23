import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { ComponentsModule } from '../components/components.module';
import { AddModalComponent } from './modals/add-modal.component';
import { ItemModalComponent } from './modals/item-modal/item-modal.component';
import { CategoryModalComponent } from './modals/category-modal/category-modal.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ComponentsModule,
        ReactiveFormsModule,
        FormsModule,
        TabsPageRoutingModule
    ],
    declarations: [
        TabsPage,
        AddModalComponent,
        ItemModalComponent,
        CategoryModalComponent
    ]
})
export class TabsPageModule {}
