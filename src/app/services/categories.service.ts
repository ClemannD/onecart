import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category.model';
import { AbstractDataService } from './data-service/abstract-data.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
    public categories$: Observable<Category[]> = this._dataService.categories$;

    constructor(
        @Inject(AbstractDataService) private _dataService: AbstractDataService
    ) {
        this.categories$.subscribe((_) => {
            console.log(_);
        });
    }

    public saveCategory(category: Category): void {
        if (!category.categoryKey) {
            category.categoryKey = this._dataService.generateUid();
            category.categoryRoute = category.categoryName.replace(/\W/g, '');
            this._dataService.createCategory(category);
        } else {
            this._dataService.updateCategory(category);
        }
    }
}
