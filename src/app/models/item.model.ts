export interface Item {
    itemKey?: string;
    itemName?: string;
    itemCost?: number;
    itemState?: ItemState;
    refCategoryKey?: string;
}

export enum ItemState {
    InStock = 1,
    OutOfStock = 2,
    NotNeeded = 3
}
