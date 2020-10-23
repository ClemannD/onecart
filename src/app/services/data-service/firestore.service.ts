import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Item, ItemState } from 'src/app/models/item.model';
import { AbstractDataService } from './abstract-data.service';

@Injectable()
export class FirestoreService implements AbstractDataService {
    private _itemsCollection = this._angularFirestore.collection<Item>('items');
    private _categoriesCollection = this._angularFirestore.collection(
        'categories'
    );

    public items$ = this._itemsCollection.valueChanges();
    public categories$ = this._categoriesCollection.valueChanges();

    constructor(private _angularFirestore: AngularFirestore) {}

    public generateUid(): string {
        return this._angularFirestore.createId();
    }
    public createItem(item: Item): void {
        this._itemsCollection.doc(item.itemKey).set(item);
    }
    public updateItem(item: Item): void {
        this._itemsCollection.doc(item.itemKey).update(item);
    }
    public createCategory(category: Category): void {
        this._categoriesCollection.doc(category.categoryKey).set(category);
    }
    public updateCategory(category: Category): void {
        this._categoriesCollection.doc(category.categoryKey).update(category);
    }
    // public fetchItems(): Observable<Item[]> {
    //     console.log('fetchItems');

    //     return this._itemsCollection.valueChanges();
    // }
    // public fetchCategories(): Observable<Category[]> {
    //     console.log('fetchCategories');
    //     return this._categoriesCollection.valueChanges();
    // }
}

const MOCK_CATEGORIES = [
    {
        categoryKey: 'cleaningSuppliesKey',
        categoryName: 'Cleaning Supplies',
        categoryRoute: 'CleaningSupplies',
        categoryIcon: 'ios-spray-can',
        total: 27
    },
    {
        categoryKey: 'dairyKey',
        categoryName: 'Dairy',
        categoryRoute: 'Dairy',
        categoryIcon: 'ios-cow',
        total: 13
    },
    {
        categoryKey: 'meatsKey',
        categoryName: 'Meats',
        categoryRoute: 'Meats',
        categoryIcon: 'ios-drumstick',
        total: 23
    },
    {
        categoryKey: 'carbsKey',
        categoryName: 'Carbs',
        categoryRoute: 'Carbs',
        categoryIcon: 'ios-wheat',
        total: 9
    },
    {
        categoryKey: 'fruitsKey',
        categoryName: 'Fruits',
        categoryRoute: 'Fruits',
        categoryIcon: 'ios-apple-crate',
        total: 18
    }
];

const MOCK_ITEM_DATA = [
    {
        itemKey: 'item1',
        itemName: 'Laundry Detergent',
        itemCost: 9.5,
        itemState: ItemState.InStock,
        refCategoryKey: 'cleaningSuppliesKey'
    },
    {
        itemKey: 'item2',
        itemName: 'Clorox Wipes',
        itemCost: 3.5,
        itemState: ItemState.OutOfStock,
        refCategoryKey: 'cleaningSuppliesKey'
    },
    {
        itemKey: 'item3',
        itemName: 'Windex',
        itemCost: 3,
        itemState: ItemState.NotNeeded,
        refCategoryKey: 'cleaningSuppliesKey'
    },
    {
        itemKey: 'item4',
        itemName: 'Laundry Detergent',
        itemCost: 9.5,
        itemState: ItemState.InStock,
        refCategoryKey: 'cleaningSuppliesKey'
    },
    {
        itemKey: 'item5',
        itemName: 'Milk',
        itemCost: 4,
        itemState: ItemState.OutOfStock,
        refCategoryKey: 'dairyKey'
    },
    {
        itemKey: 'item6',
        itemName: 'Cheese',
        itemCost: 3,
        itemState: ItemState.OutOfStock,
        refCategoryKey: 'dairyKey'
    }
];
