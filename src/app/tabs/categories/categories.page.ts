import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    Gesture,
    GestureController,
    GestureDetail,
    NavController
} from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
    selector: 'app-categories',
    templateUrl: 'categories.page.html',
    styleUrls: ['categories.page.scss']
})
export class CategoriesPage implements AfterViewInit, OnDestroy {
    public category$ = combineLatest([
        this._activatedRoute.params,
        this._categoriesService.categories$
    ]).pipe(
        map(([params, categories]) => {
            if (params.category) {
                return categories.find(
                    (category) => category.categoryRoute === params.category
                );
            } else {
                return categories[0];
            }
        })
    );

    public categroyIndex$ = combineLatest([
        this.category$,
        this._categoriesService.categories$
    ]).pipe(
        map(([currentCategory, categories]) => {
            return categories.findIndex(
                (category) =>
                    category.categoryKey === currentCategory.categoryKey
            );
        })
    );

    public isLastCategory$ = combineLatest([
        this.category$,
        this._categoriesService.categories$
    ]).pipe(
        map(([currentCategory, categories]) => {
            const currentIndex = categories.findIndex(
                (category) =>
                    category.categoryKey === currentCategory.categoryKey
            );
            return currentIndex === categories.length - 1;
        })
    );

    public swipeGesture: Gesture;

    constructor(
        private _categoriesService: CategoriesService,
        private _activatedRoute: ActivatedRoute,
        private _gestureController: GestureController,
        private _navController: NavController,
        private _element: ElementRef
    ) {}

    public ngAfterViewInit(): void {
        this.swipeGesture = this._gestureController.create(
            {
                gestureName: 'swipeCategoryGetsure',
                el: this._element.nativeElement,
                threshold: 80,
                direction: 'x',
                onEnd: (detail) => {
                    this._handleSwipeGesture(detail);
                }
            },
            true
        );

        this.swipeGesture.enable();
    }

    public ngOnDestroy(): void {
        this.swipeGesture.destroy();
    }

    private _handleSwipeGesture(detail: GestureDetail): void {
        if (detail.currentX < detail.startX) {
            this.goForwardCategory();
        } else {
            this.goBackCategory();
        }
    }

    public goForwardCategory(): void {
        this.categroyIndex$
            .pipe(withLatestFrom(this._categoriesService.categories$), take(1))
            .subscribe(([currentIndex, categories]) => {
                if (currentIndex < categories.length - 1) {
                    this._navController.navigateForward(
                        `/tabs/categories/${
                            categories[currentIndex + 1].categoryRoute
                        }`
                    );
                }
            });
    }
    public goBackCategory(): void {
        this.categroyIndex$
            .pipe(withLatestFrom(this._categoriesService.categories$), take(1))
            .subscribe(([currentIndex, categories]) => {
                if (currentIndex > 0) {
                    this._navController.navigateBack(
                        `/tabs/categories/${
                            categories[currentIndex - 1].categoryRoute
                        }`
                    );
                }
            });
    }
}
