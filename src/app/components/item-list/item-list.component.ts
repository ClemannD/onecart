import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { formatMoney } from 'src/app/helpers/format.helpers';
import { Item, ItemState } from 'src/app/models/item.model';
import { ItemsService } from 'src/app/services/items.service';
import { AddModalService } from 'src/app/tabs/modals/add-modal.service';

@Component({
    selector: 'item-list',
    styleUrls: ['./item-list.component.scss'],
    template: `
        <div class="item-list">
            <ion-spinner *ngIf="!(items$ | async)"></ion-spinner>
            <ng-container *ngIf="!!(items$ | async)">
                <div
                    *ngIf="!(items$ | async)?.length && !disableEdit"
                    class="no-items"
                >
                    <div class="no-items-label">
                        There are no items yet in this category.
                    </div>
                    <app-button fill="clear" (buttonClick)="addItem.emit()">
                        Add an Item
                    </app-button>
                </div>
                <div class="item-row" *ngFor="let item of items$ | async">
                    <div
                        class="item-row-left"
                        (click)="handleItemStateToggleClick(item)"
                    >
                        <ion-icon
                            [name]="iconNameEnum[item.itemState]"
                        ></ion-icon>
                        <span>{{ item.itemName }}</span>
                    </div>
                    <div
                        class="item-row-right"
                        (click)="handleEditItemClick(item)"
                    >
                        <div>
                            <span class="currency-symbol">$</span
                            >{{ formatMoney(item.itemCost) }}
                        </div>
                        <ion-icon
                            *ngIf="!disableEdit"
                            class="edit-button"
                            name="ios-chevron-right"
                        ></ion-icon>
                    </div>
                </div>
            </ng-container>
        </div>
    `
})
export class ItemListComponent {
    @Input() public items$: Observable<Item[]>;
    @Input() public disableEdit = false;
    @Output() public addItem = new EventEmitter();

    public formatMoney = formatMoney;

    public dollarFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    public iconNameEnum = {
        [ItemState.NotNeeded]: 'ios-empty-set',
        [ItemState.InStock]: 'ios-check-circle',
        [ItemState.OutOfStock]: 'ios-circle'
    };

    constructor(
        private _itemsService: ItemsService,
        private _addModalService: AddModalService
    ) {}

    public async handleItemStateToggleClick(item: Item): Promise<void> {
        item.itemState =
            item.itemState === ItemState.NotNeeded ||
            item.itemState === ItemState.InStock
                ? ItemState.OutOfStock
                : ItemState.InStock;

        await this._itemsService.saveItem(item);
    }

    public handleEditItemClick(item: Item): void {
        if (!this.disableEdit) {
            this._addModalService.showItemModal(item);
        }
    }
}
