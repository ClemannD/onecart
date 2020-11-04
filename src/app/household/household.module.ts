import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HouseholdPageRoutingModule } from './household-routing.module';

import { HouseholdPage } from './household.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        HouseholdPageRoutingModule,
        ComponentsModule
    ],
    declarations: [HouseholdPage]
})
export class HouseholdPageModule {}
