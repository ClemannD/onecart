import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { AbstractDataService } from './data-service/abstract-data.service';
import { HouseholdService } from './household.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
    public categories$: Observable<Category[]> = this._dataService.categories$;

    constructor(
        @Inject(AbstractDataService) private _dataService: AbstractDataService,
        private _hosueholdService: HouseholdService
    ) {
        // this.categories$.subscribe((_) => {
        //     console.log(_);
        // });
    }

    public async saveCategory(category: Category): Promise<void> {
        if (!category.categoryKey) {
            category.refHouseholdKey = (
                await this._hosueholdService.household$
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
}
