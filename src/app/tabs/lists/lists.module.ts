import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListsPage } from './lists.page';

import { ListsPageRoutingModule } from './lists-routing.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{ path: '', component: ListsPage }]),
        ListsPageRoutingModule
    ],
    declarations: [ListsPage]
})
export class ListsPageModule {}
