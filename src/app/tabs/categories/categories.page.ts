import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, pluck, shareReplay, switchMap } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import { Item, ItemState } from 'src/app/models/item.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
    selector: 'app-categories',
    templateUrl: 'categories.page.html',
    styleUrls: ['categories.page.scss']
})
export class CategoriesPage implements AfterViewInit {
    public categories$: Observable<Category[]> = this._categoriesService
        .categories$;

    // public activeCategory$ = combineLatest(
    //     this.categories$,
    //     this._activatedRoute.params
    // ).pipe(
    //     map(([categories, params]) => {
    //         console.log(params);
    //         console.log(categories);

    //         return categories.find(
    //             (category) => category.categoryRoute === params.category
    //         );
    //     }),
    //     shareReplay()
    // );

    constructor(
        private _categoriesService: CategoriesService,
        private _activatedRoute: ActivatedRoute
    ) {}

    public ngAfterViewInit(): void {
        // this._activatedRoute.params.subscribe((params) => {
        //     if (params.category) {
        //         document.getElementById(params.category).scrollTo();
        //     }
        // });
    }
}
