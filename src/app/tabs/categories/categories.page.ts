import {
    AfterViewInit,
    Component,
    ElementRef,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
    selector: 'app-categories',
    templateUrl: 'categories.page.html',
    styleUrls: ['categories.page.scss']
})
export class CategoriesPage implements AfterViewInit {
    @ViewChild('categoriesViewport')
    public categoriesViewport: ElementRef;
    @ViewChildren('category') public categoryElements: QueryList<ElementRef>;

    public categories$: Observable<Category[]> = this._categoriesService
        .categories$;

    constructor(
        private _categoriesService: CategoriesService,
        private _activatedRoute: ActivatedRoute
    ) {}

    public ngAfterViewInit(): void {
        combineLatest([
            this._activatedRoute.params,
            this.categoryElements.changes
        ]).subscribe(([params, categoryElements]) => {
            if (params.category) {
                const targetCategory = categoryElements._results.forEach(
                    (categoryElement, index) => {
                        if (
                            categoryElement.nativeElement.id === params.category
                        ) {
                            this.categoriesViewport.nativeElement.scrollLeft =
                                window.innerWidth * index;
                        }
                    }
                );
            }
        });
    }
}
