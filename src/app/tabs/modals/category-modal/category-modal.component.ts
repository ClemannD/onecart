import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CategoryIconNames } from 'src/app/constants/category-icons';
import { Category } from 'src/app/models/category.model';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
    selector: 'category-modal',
    template: `
        <form [formGroup]="categoryFormGroup" (ngSubmit)="saveCategory()">
            <h3>
                {{ category?.categoryKey ? 'Edit Category' : 'New Category' }}
            </h3>
            <app-input
                inputLabel="Name"
                placeholder="Enter Category Name"
                formControlName="categoryName"
                [formControl]="categoryNameFormControl"
                [maxlength]="25"
            >
                <div *ngIf="categoryNameFormControl.errors?.required">
                    Please Enter a Category Name
                </div>
            </app-input>
            <ion-label>Select an Icon</ion-label>

            <div
                class="category-icons"
                [class]="{ 'has-error': categoryIconModelError }"
            >
                <ion-icon
                    *ngFor="let iconName of categoryIconNames"
                    [class]="{ selected: categoryIconModel === iconName }"
                    (click)="updateCategoryIcon(iconName)"
                    [name]="iconName"
                ></ion-icon>
            </div>
            <div class="category-icons-error" *ngIf="categoryIconModelError">
                Please Select an Icon for your Category
            </div>

            <app-button class="add-button" type="submit">
                <ion-icon slot="start" name="ios-layer-plus"></ion-icon>
                Save Category
            </app-button>
            <app-button
                color="secondary"
                fill="clear"
                (buttonClick)="closeModal()"
            >
                Cancel
            </app-button>
        </form>
    `
})
export class CategoryModalComponent implements OnInit {
    @Input() public category: Category;

    public categoryIconModel: string;
    public categoryIconModelError = false;
    public categoryFormGroup: FormGroup;
    public categoryIconNames = CategoryIconNames;

    constructor(
        private _categoriesService: CategoriesService,
        private _modalController: ModalController,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.categoryIconModel = this.category?.categoryIcon || '';

        this.categoryFormGroup = this._formBuilder.group({
            categoryName: [
                this.category?.categoryName || '',
                Validators.required
            ]
        });
    }

    public async saveCategory(): Promise<void> {
        this.categoryNameFormControl.markAsTouched();
        this.categoryIconModelError = !this.categoryIconModel;

        if (this.categoryFormGroup.valid && !this.categoryIconModelError) {
            await this._categoriesService.saveCategory({
                ...this.category,
                categoryName: this.categoryNameFormControl.value,
                categoryIcon: this.categoryIconModel
            });
            this.closeModal();
        }
    }

    public updateCategoryIcon(iconName: string): void {
        this.categoryIconModelError = false;
        this.categoryIconModel = iconName;
    }

    public closeModal(): void {
        this._modalController.dismiss();
    }

    public get categoryNameFormControl() {
        return this.categoryFormGroup.get('categoryName');
    }
}
