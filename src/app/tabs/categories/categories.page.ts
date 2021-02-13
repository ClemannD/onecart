import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import {
    BehaviorSubject,
    combineLatest,
    Observable,
    Subject,
    Subscription
} from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { WindowService } from 'src/app/services/window.service';

@Component({
    selector: 'app-categories',
    templateUrl: 'categories.page.html',
    styleUrls: ['categories.page.scss']
})
export class CategoriesPage implements AfterViewInit, OnDestroy {
    @ViewChild('categoriesViewport')
    public categoriesViewport: ElementRef;
    @ViewChild(IonContent)
    public ionContent: IonContent;
    @ViewChildren('category') public categoryElements: QueryList<ElementRef>;

    private _horizontalScrollLeftSubject = new BehaviorSubject<number>(null);
    public horizontalScrollLeft$ = this._horizontalScrollLeftSubject.asObservable();

    private _scrollEndedSubject = new Subject();
    public scrollEnded$ = this._scrollEndedSubject.asObservable();

    public categories$: Observable<Category[]> = this._categoriesService
        .categories$;

    public category$: Observable<Category> = this._categoriesService
        .currentCategory$;

    private _shouldScrollYSubject = new BehaviorSubject<boolean>(true);
    public shouldScrollY$ = this._shouldScrollYSubject.asObservable();

    private _initialScrollSub: Subscription;

    constructor(
        private _categoriesService: CategoriesService,
        private _activatedRoute: ActivatedRoute,
        private _windowService: WindowService
    ) {
        combineLatest([this.horizontalScrollLeft$, this.categories$])
            .pipe(
                map(([horizontalScroll, categories]) => {
                    let categoryIndex = parseInt(
                        (horizontalScroll / window.innerWidth).toFixed(0)
                    );
                    categoryIndex = categoryIndex < 0 ? 0 : categoryIndex;
                    return categories[categoryIndex];
                })
            )
            .subscribe((category) => {
                this._categoriesService.currentCategory$.next(category);
            });
    }

    public ngAfterViewInit(): void {
        this._initialScrollSub = combineLatest([
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

        combineLatest([this.category$, this.categoryElements.changes])
            .pipe(distinctUntilChanged((prev, curr) => prev[0] === curr[0]))
            .subscribe(([category, categoryElements]) => {
                categoryElements._results.forEach((categoryElement, index) => {
                    if (
                        categoryElement.nativeElement.id ===
                        category.categoryRoute
                    ) {
                        this.ionContent.scrollToTop(800);
                    }
                });
            });
    }

    public ngOnDestroy(): void {
        this._initialScrollSub.unsubscribe();
    }

    public handleScroll(event): void {
        this._horizontalScrollLeftSubject.next(
            this.categoriesViewport.nativeElement.scrollLeft
        );
    }
}
