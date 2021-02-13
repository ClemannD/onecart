import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';
import { ItemsService } from 'src/app/services/items.service';

@Component({
    selector: 'shop-category',
    styleUrls: ['./shop-category.component.scss'],
    template: `
        <div class="shop-category" *ngIf="(categoryItems$ | async)?.length">
            <div class="category-name">
                {{ category.categoryName }}
            </div>
            <item-list
                [items$]="categoryItems$"
                [disableEdit]="true"
            ></item-list>
        </div>
    `
})
export class ShopCategoryComponent implements OnInit {
    @Input() public category: Category;
    public categoryItems$: Observable<Item[]>;

    constructor(private _itemsService: ItemsService) {}

    ngOnInit() {}

    public ngOnChanges(_): void {
        if (this.category) {
            this.categoryItems$ = this._itemsService.getOutOfStockItemsForCategory$(
                this.category.categoryKey
            );
        }
    }
}
