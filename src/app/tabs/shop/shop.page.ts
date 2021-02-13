import { Component } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
    selector: 'app-shop',
    templateUrl: 'shop.page.html',
    styleUrls: ['./shop.page.scss']
})
export class ShopPage {
    public categories$ = this._categoriesService.categories$;
    public emptyList$ = this._itemsService.noOutOfStockItems$;

    constructor(
        private _categoriesService: CategoriesService,
        private _itemsService: ItemsService
    ) {}
}
