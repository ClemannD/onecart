import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatMoney } from 'src/app/helpers/format.helpers';
import { stringToRoute } from 'src/app/helpers/route.helpers';
import { Category } from 'src/app/models/category.model';
import { Item, ItemState } from 'src/app/models/item.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { ItemsService } from 'src/app/services/items.service';
import { AddModalService } from '../modals/add-modal.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
    public categories$: Observable<Category[]> = this._categoriesService
        .categories$;
    public items$: Observable<Item[]> = this._itemsService.items$;

    public dataPoints: { dataLabel: string; dataValue: Observable<any> }[];

    public today = format(new Date(), 'EEEE, MMM d');

    constructor(
        private _addModalService: AddModalService,
        private _itemsService: ItemsService,
        private _categoriesService: CategoriesService
    ) {}

    public ngOnInit(): void {
        this.initializeDataPoints();
    }

    public getEstimatedCostForCategory$(
        categoryKey: string
    ): Observable<number> {
        return this._itemsService.getEstimatedCostForCategory$(categoryKey);
    }

    public initializeDataPoints(): void {
        this.dataPoints = [
            {
                dataLabel: 'Total Items',
                dataValue: this.items$.pipe(map((items) => items.length))
            },
            {
                dataLabel: 'Items In Stock',
                dataValue: this.items$.pipe(
                    map(
                        (items) =>
                            items.filter(
                                (item) => item.itemState === ItemState.InStock
                            ).length
                    )
                )
            },
            {
                dataLabel: 'Items to Get',
                dataValue: this.items$.pipe(
                    map(
                        (items) =>
                            items.filter(
                                (item) =>
                                    item.itemState === ItemState.OutOfStock
                            ).length
                    )
                )
            },
            {
                dataLabel: 'Estimated Cost',
                dataValue: this.items$.pipe(
                    map((items) =>
                        formatMoney(
                            items
                                .filter(
                                    (item) =>
                                        item.itemState === ItemState.OutOfStock
                                )
                                .reduce((sum, item) => {
                                    return sum + item.itemCost;
                                }, 0)
                        )
                    )
                )
            }
        ];
    }

    public addCategory(): void {
        this._addModalService.showCategoryModal();
    }
}
