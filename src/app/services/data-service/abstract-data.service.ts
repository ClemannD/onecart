import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Household } from 'src/app/models/household.model';
import { Item } from 'src/app/models/item.model';

@Injectable()
export class AbstractDataService {
    public items$: Observable<Item[]>;
    public categories$: Observable<Category[]>;
    public household$: Observable<Household>;

    constructor() {}

    public initializeApp: () => void;
    public generateUid: () => string;

    public createItem: (item: Item) => void;
    public updateItem: (item: Item) => void;
    public deleteItem: (itemKey: string) => void;

    public createCategory: (category: Category) => void;
    public updateCategory: (category: Category) => void;
    public deleteCategory: (categoryKey: string) => void;

    public createHousehold: (household: Household) => void;
    public updateHousehold: (household: Household) => void;
    public getHouseholdByCode: (
        householdCode: string
    ) => Observable<Household[]>;
}
