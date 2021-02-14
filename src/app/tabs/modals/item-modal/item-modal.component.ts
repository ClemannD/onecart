import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item, ItemState } from 'src/app/models/item.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
    selector: 'item-modal',
    template: `
        <form
            *ngIf="itemFormGroup"
            [formGroup]="itemFormGroup"
            (ngSubmit)="saveItem()"
            (keydown.enter)="saveItem()"
        >
            <h3>{{ item?.itemKey ? 'Edit Item' : 'New Item' }}</h3>
            <app-input
                inputLabel="Name"
                placeholder="Enter Item Name"
                formControlName="itemName"
                name="itemName"
                [formControl]="itemNameFormControl"
                [maxlength]="40"
            >
                <div *ngIf="itemNameFormControl.errors?.required">
                    Please Enter an Item Name
                </div>
            </app-input>
            <app-select
                inputLabel="Category"
                placeholder="Select a Category"
                formControlName="itemCategory"
                name="itemCategory"
                [options]="categoryOptions"
            >
                <div *ngIf="itemCategoryFormControl.errors?.required">
                    Please Select a Category
                </div>
            </app-select>
            <app-input
                class="cost-input"
                inputLabel="Cost (Approximate)"
                placeholder="Use the Buttons to Set Cost"
                formControlName="itemCost"
                name="itemCost"
                [disabled]="true"
                [formControl]="itemCostFormControl"
            >
            </app-input>
            <div class="cost-controls">
                <app-button
                    size="small"
                    fill="outline"
                    [isBlock]="false"
                    [disabled]="itemCostModel < 5"
                    (buttonClick)="updateCost(-5)"
                >
                    - $5
                </app-button>
                <app-button
                    size="small"
                    fill="outline"
                    [isBlock]="false"
                    [disabled]="itemCostModel < 1"
                    (buttonClick)="updateCost(-1)"
                >
                    - $1
                </app-button>
                <app-button
                    size="small"
                    fill="outline"
                    [isBlock]="false"
                    [disabled]="itemCostModel < 0.5"
                    (buttonClick)="updateCost(-0.5)"
                >
                    - $.5
                </app-button>
                <app-button
                    size="small"
                    fill="outline"
                    [isBlock]="false"
                    (buttonClick)="updateCost(0.5)"
                >
                    + $.5
                </app-button>
                <app-button
                    size="small"
                    fill="outline"
                    [isBlock]="false"
                    (buttonClick)="updateCost(1)"
                >
                    + $1
                </app-button>
                <app-button
                    size="small"
                    fill="outline"
                    [isBlock]="false"
                    (buttonClick)="updateCost(5)"
                >
                    + $5
                </app-button>
            </div>
            <app-button
                *ngIf="!!item?.itemState"
                class="add-button"
                fill="outline"
                (buttonClick)="updateItemState(itemStateFormControl.value)"
            >
                Mark as
                {{
                    itemStateFormControl.value === itemState.NotNeeded
                        ? ''
                        : 'Not'
                }}
                Needed
            </app-button>
            <app-button class="add-button" type="submit">
                <ion-icon slot="start" name="ios-list-plus"></ion-icon>
                Save Item
            </app-button>
            <app-button
                *ngIf="item.itemKey"
                fill="clear"
                color="danger"
                [style.marginBottom]="'2rem'"
                (buttonClick)="deleteItem()"
            >
                Delete Item
            </app-button>
            <app-button
                color="secondary"
                fill="clear"
                (buttonClick)="closeModal()"
            >
                Cancel
            </app-button>
        </form>
    `
})
export class ItemModalComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public item: Item;

    public itemCostModel: number;
    public itemFormGroup: FormGroup;
    public itemState = ItemState;

    public categoryOptions: { value: string; label: string }[];

    private _categoriesSub: Subscription;

    constructor(
        private _modalController: ModalController,
        private _formBuilder: FormBuilder,
        private _categoriesService: CategoriesService,
        private _itemsService: ItemsService,
        private _alertController: AlertController
    ) {
        this._categoriesSub = this._categoriesService.categories$.subscribe(
            (categories) => {
                this.categoryOptions = categories.map((category) => ({
                    value: category.categoryKey,
                    label: category.categoryName
                }));

                this.itemFormGroup = this._formBuilder.group({
                    itemName: [this.item?.itemName || '', Validators.required],
                    itemCategory: [
                        this.item?.refCategoryKey || '',
                        Validators.required
                    ],
                    itemState: [this.item?.itemState || ''],
                    itemCost: [
                        `$${this.itemCostModel}` || '',
                        Validators.required
                    ]
                });
            }
        );
    }

    public ngOnInit(): void {
        this.itemCostModel = this.item?.itemCost || 0;
    }
    public ngAfterViewInit(): void {}

    public ngOnDestroy(): void {
        this._categoriesSub.unsubscribe();
    }

    public async saveItem(): Promise<void> {
        this.itemNameFormControl.markAsTouched();
        this.itemCategoryFormControl.markAsTouched();

        if (this.itemFormGroup.valid) {
            const item = {
                ...this.item,
                itemName: this.itemNameFormControl.value,
                refCategoryKey: this.itemCategoryFormControl.value,
                itemCost: this.itemCostModel,
                itemState: this.itemStateFormControl.value
            };
            await this._itemsService.saveItem(item);
            this.closeModal();
        }
    }

    public async updateItemState(currentState: ItemState): Promise<void> {
        if (currentState === ItemState.NotNeeded) {
            this.itemStateFormControl.setValue(ItemState.OutOfStock);
        } else {
            this.itemStateFormControl.setValue(ItemState.NotNeeded);
        }
        await this.saveItem();
    }

    public updateCost(costChange: number): void {
        this.itemCostModel += costChange;
        this.itemCostFormControl.setValue(
            `$${this.itemCostModel}`.replace('.00', '')
        );
    }

    public async deleteItem(): Promise<void> {
        const alert = await this._alertController.create({
            header: 'Delete Item',
            message: `Are you sure you want to delete ${this.item.itemName}`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        alert.dismiss();
                    }
                },
                {
                    text: 'Delete',
                    handler: async () => {
                        this._itemsService.deleteItem(this.item.itemKey);
                        alert.dismiss();
                        this.closeModal();
                    }
                }
            ]
        });

        await alert.present();
    }

    public closeModal(): void {
        this._modalController.dismiss();
    }

    public get itemNameFormControl() {
        return this.itemFormGroup.get('itemName');
    }
    public get itemCategoryFormControl() {
        return this.itemFormGroup.get('itemCategory');
    }
    public get itemCostFormControl() {
        return this.itemFormGroup.get('itemCost');
    }
    public get itemStateFormControl() {
        return this.itemFormGroup.get('itemState');
    }
}
