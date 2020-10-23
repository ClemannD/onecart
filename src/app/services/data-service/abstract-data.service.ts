import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';

@Injectable()
export class AbstractDataService {
    public items$: Observable<Item[]>;
    public categories$: Observable<Category[]>;

    constructor() {}

    public generateUid: () => string;
    public createItem: (item: Item) => void;
    public updateItem: (item: Item) => void;
    public createCategory: (category: Category) => void;
    public updateCategory: (category: Category) => void;
}
