import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { AbstractDataService } from './data-service/abstract-data.service';
import { HouseholdService } from './household.service';
import { ItemsService } from './items.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
    public categories$: Observable<
        Category[]
    > = this._dataService.categories$.pipe(
        map((categories) => {
            return categories.sort((a, b) =>
                a.categoryName > b.categoryName ? 1 : -1
            );
        })
    );

    public currentCategory$ = new BehaviorSubject<Category>(null);

    constructor(
        @Inject(AbstractDataService) private _dataService: AbstractDataService,
        private _itemsService: ItemsService,
        private _householdService: HouseholdService
    ) {}

    public async saveCategory(category: Category): Promise<void> {
        if (!category.categoryKey) {
            category.refHouseholdKey = (
                await this._householdService.household$
                    .pipe(first())
                    .toPromise()
            ).householdKey;
            category.categoryKey = this._dataService.generateUid();
            category.categoryRoute = category.categoryName.replace(/\W/g, '');
            this._dataService.createCategory(category);
        } else {
            this._dataService.updateCategory(category);
        }
    }

    public async deleteCategory(categoryKey: string): Promise<void> {
        const itemsForCategory = await this._itemsService
            .getItemsForCategory$(categoryKey)
            .pipe(first())
            .toPromise();

        for (let i = 0; i < itemsForCategory.length; i++) {
            await this._itemsService.deleteItem(itemsForCategory[i].itemKey);
        }
        await this._dataService.deleteCategory(categoryKey);
    }
}
