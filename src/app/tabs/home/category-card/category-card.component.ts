import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { ItemsService } from 'src/app/services/items.service';

@Component({
    selector: 'category-card',
    styleUrls: ['./category-card.component.scss'],
    template: `<div
        class="category-box"
        (click)="handleCategoryClick(category)"
    >
        <div class="category-icon">
            <ion-icon [name]="category.categoryIcon"> </ion-icon>
            <div class="icon-backdrop"></div>
        </div>
        <div class="category-label">
            {{ category.categoryName }}
        </div>
        <div class="category-cost">
            <span class="category-dollar-sign">$</span
            >{{ estimatedCost$ | async }}
        </div>
    </div>`
})
export class CategoryCardComponent implements OnInit {
    @Input() public category: Category;

    public estimatedCost$: Observable<number>;

    constructor(private _itemsService: ItemsService, private _router: Router) {}

    public ngOnInit(): void {
        this.estimatedCost$ = this._itemsService.getEstimatedCostForCategory$(
            this.category.categoryKey
        );
    }

    public handleCategoryClick(category: Category): void {
        this._router.navigate(['tabs/categories', category.categoryRoute]);
    }
}
