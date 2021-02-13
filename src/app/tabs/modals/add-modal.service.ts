import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddModalState } from 'src/app/constants/common';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { AddModalComponent } from './add-modal.component';

@Injectable({ providedIn: 'root' })
export class AddModalService {
    constructor(public modalController: ModalController) {}

    public async showAddModal(): Promise<void> {
        const modal = await this.modalController.create({
            component: AddModalComponent,
            cssClass: 'auto-height'
        });
        await modal.present();
    }

    public async showItemModal(item?: Item): Promise<void> {
        const modal = await this.modalController.create({
            component: AddModalComponent,
            cssClass: 'auto-height',
            componentProps: {
                item: item,
                modalState: AddModalState.AddItem
            }
        });
        await modal.present();
    }

    public async showCategoryModal(category?: Category): Promise<void> {
        const modal = await this.modalController.create({
            component: AddModalComponent,
            cssClass: 'auto-height',
            componentProps: {
                category,
                modalState: AddModalState.AddCategory
            }
        });
        await modal.present();
    }
}
