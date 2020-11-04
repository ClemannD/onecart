import { Inject, Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Item, ItemState } from '../models/item.model';
import { AbstractDataService } from './data-service/abstract-data.service';
import { HouseholdService } from './household.service';

@Injectable({ providedIn: 'root' })
export class ItemsService {
    public items$: Observable<Item[]> = this._dataService.items$;

    constructor(
        @Inject(AbstractDataService) private _dataService: AbstractDataService,
        private _hosueholdService: HouseholdService
    ) {}

    public getItemsForCategory$(categoryKey: string): Observable<Item[]> {
        return this.items$.pipe(
            map((items) =>
                items.filter((item) => item.refCategoryKey === categoryKey)
            )
        );
    }

    public getOrderedItemsForCategory$(
        categoryKey: string,
        includeNotNeeded = true
    ): Observable<Item[]> {
        return combineLatest([
            this.getOutOfStockItemsForCategory$(categoryKey),
            this.getInStockItemsForCategory$(categoryKey),
            this.getNotNeededItemsForCategory$(categoryKey)
        ]).pipe(
            map(([outOfStockItems, inStockItems, notNeededItems]) => {
                if (includeNotNeeded) {
                    return [
                        ...outOfStockItems,
                        ...inStockItems,
                        ...notNeededItems
                    ];
                }
                return [...outOfStockItems, ...inStockItems];
            })
        );
    }

    public getEstimatedCostForCategory$(
        categoryKey: string
    ): Observable<number> {
        return this.getItemsForCategory$(categoryKey).pipe(
            map((items) =>
                items
                    .filter((item) => item.itemState === ItemState.OutOfStock)
                    .reduce((sum, item) => {
                        return sum + item.itemCost;
                    }, 0)
            )
        );
    }

    public getOutOfStockItemsForCategory$(
        categoryKey: string
    ): Observable<Item[]> {
        return this.getItemsForCategory$(categoryKey).pipe(
            map((items) =>
                items.filter((item) => item.itemState === ItemState.OutOfStock)
            )
        );
    }

    public getInStockItemsForCategory$(
        categoryKey: string
    ): Observable<Item[]> {
        return this.getItemsForCategory$(categoryKey).pipe(
            map((items) =>
                items.filter((item) => item.itemState === ItemState.InStock)
            )
        );
    }
    public getNotNeededItemsForCategory$(
        categoryKey: string
    ): Observable<Item[]> {
        return this.getItemsForCategory$(categoryKey).pipe(
            map((items) =>
                items.filter((item) => item.itemState === ItemState.NotNeeded)
            )
        );
    }

    public async saveItem(item: Item): Promise<void> {
        if (!item.itemKey) {
            item.refHouseholdKey = (
                await this._hosueholdService.household$
                    .pipe(first())
                    .toPromise()
            ).householdKey;
            item.itemKey = this._dataService.generateUid();
            item.itemState = ItemState.OutOfStock;
            this._dataService.createItem(item);
        } else {
            console.log(item);

            this._dataService.updateItem(item);
        }
    }
}
