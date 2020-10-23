import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { SelectComponent } from './select/select.component';
import { InfoBoxComponent } from './info-box/info-box.component';
import { SectionLabelComponent } from './section-label/section-label.component';
import { ItemListComponent } from './item-list/item-list.component';

const COMPONENTS = [
    InputComponent,
    ButtonComponent,
    SelectComponent,
    InfoBoxComponent,
    SectionLabelComponent,
    ItemListComponent
];

@NgModule({
    declarations: COMPONENTS,
    imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
    exports: COMPONENTS
})
export class ComponentsModule {}
