import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatMoney } from 'src/app/helpers/format.helpers';
import { Category } from 'src/app/models/category.model';
import { Item, ItemState } from 'src/app/models/item.model';
import { ItemsService } from 'src/app/services/items.service';
import { AddModalService } from '../../modals/add-modal.service';

@Component({
    selector: 'category',
    styleUrls: ['./category.component.scss'],
    template: `
        <div class="category">
            <info-box>
                <div class="data-points">
                    <div
                        class="data-point"
                        *ngFor="let dataPoint of dataPoints"
                    >
                        <div class="data-value">
                            <span
                                *ngIf="dataPoint.dataLabel === 'Estimated Cost'"
                                class="currency-symbol"
                                >$</span
                            >{{ (dataPoint.dataValue | async) || '0' }}
                        </div>
                        <h6>{{ dataPoint.dataLabel }}</h6>
                    </div>
                </div>
            </info-box>

            <div class="category-actions">
                <app-button
                    class="action-button"
                    fill="outline"
                    color="secondary"
                    (buttonClick)="addItem()"
                >
                    Add Item
                </app-button>
                <app-button
                    class="action-button"
                    fill="outline"
                    color="secondary"
                    (buttonClick)="handleEditClick()"
                >
                    Edit Category
                </app-button>
            </div>

            <div class="swipe-instructions">
                <div class="swipe-arrow">
                    <ion-icon
                        *ngIf="!isFirst"
                        name="arrow-back-sharp"
                    ></ion-icon>
                </div>
                <span class="swipe">Swipe to change category</span>
                <div class="swipe-arrow">
                    <ion-icon
                        *ngIf="!isLast"
                        name="arrow-forward-sharp"
                    ></ion-icon>
                </div>
            </div>

            <div class="category-items">
                <item-list
                    *ngIf="categoryItems$"
                    [items$]="categoryItems$"
                    (addItem)="addItem()"
                ></item-list>
            </div>
        </div>
    `
})
export class CategoryComponent implements OnInit, OnChanges {
    @Input() public category: Category;
    @Input() public isFirst = false;
    @Input() public isLast = false;

    public categoryItems$: Observable<Item[]>;
    public dataPoints: {
        dataLabel: string;
        dataValue: Observable<string | number>;
    }[];

    constructor(
        private _itemsService: ItemsService,
        private _addModalService: AddModalService
    ) {}

    public ngOnChanges(_): void {
        if (this.category) {
            this.categoryItems$ = this._itemsService.getOrderedItemsForCategory$(
                this.category.categoryKey
            );
            this.initializeDataPoints();
        }
    }

    public ngOnInit(): void {}

    public handleEditClick() {
        this._addModalService.showCategoryModal(this.category);
    }

    public initializeDataPoints(): void {
        this.dataPoints = [
            {
                dataLabel: 'Total Items',
                dataValue: this.categoryItems$.pipe(
                    map((items) => items.length)
                )
            },
            {
                dataLabel: 'Items In Stock',
                dataValue: this._itemsService
                    .getInStockItemsForCategory$(this.category.categoryKey)
                    .pipe(map((items) => items.length))
            },
            {
                dataLabel: 'Items to Get',
                dataValue: this._itemsService
                    .getOutOfStockItemsForCategory$(this.category.categoryKey)
                    .pipe(map((items) => items.length))
            },
            {
                dataLabel: 'Estimated Cost',
                dataValue: this._itemsService
                    .getEstimatedCostForCategory$(this.category.categoryKey)
                    .pipe(map((amount) => formatMoney(amount)))
            }
        ];
    }

    public addItem(): void {
        this._addModalService.showItemModal({
            refCategoryKey: this.category.categoryKey
        });
    }
}
