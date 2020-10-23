import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddModalState } from 'src/app/constants/common';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';

@Component({
    selector: 'add-modal',
    styleUrls: ['./add-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="inner-content add-modal-body">
            <div *ngIf="modalState === addModalState.Select">
                <app-button
                    class="add-button"
                    (buttonClick)="showAddItemForm()"
                >
                    <ion-icon slot="start" name="ios-list-plus"></ion-icon>
                    Add Item
                </app-button>
                <app-button
                    class="add-button"
                    (buttonClick)="showAddCategoryForm()"
                >
                    <ion-icon slot="start" name="ios-layer-plus"></ion-icon>
                    Add Category
                </app-button>
                <app-button
                    color="secondary"
                    fill="clear"
                    (buttonClick)="closeModal()"
                >
                    Cancel
                </app-button>
            </div>

            <item-modal
                *ngIf="modalState === addModalState.AddItem"
                [item]="item"
            ></item-modal>

            <category-modal
                *ngIf="modalState === addModalState.AddCategory"
                [category]="category"
            ></category-modal>
        </div>
    `
})
export class AddModalComponent implements OnInit {
    @Input() public modalState = AddModalState.Select;
    @Input() public item: Item;
    @Input() public category: Category;

    public addModalState = AddModalState;

    constructor(private _modalController: ModalController) {}

    ngOnInit() {}

    public showAddItemForm(): void {
        this.modalState = AddModalState.AddItem;
    }

    public async showAddCategoryForm(): Promise<void> {
        this.modalState = AddModalState.AddCategory;
    }

    public closeModal(): void {
        this._modalController.dismiss();
    }
}
