import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { AddModalService } from './modals/add-modal.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
    public addMenuModal: HTMLIonModalElement;
    public addItemForCategoryModal: HTMLIonModalElement;
    public editItemModal: HTMLIonModalElement;
    public addCategoryModal: HTMLIonModalElement;

    private _userSub: Subscription;

    constructor(
        private _addModalService: AddModalService,
        private _authentiationService: AuthenticationService,
        private _router: Router
    ) {}
    public ngOnInit(): void {
        this._userSub = this._authentiationService.user$.subscribe((user) => {
            if (
                !!user &&
                (!user.email ||
                    !user.phoneNumber ||
                    !user.firstName ||
                    !user.lastName)
            ) {
                this._router.navigateByUrl('/register');
            } else if (!!user && !user.refHouseholdKey) {
                this._router.navigateByUrl('/household');
            }
        });
    }

    public ngOnDestroy(): void {
        this._userSub.unsubscribe();
    }

    public async showAddModal(): Promise<void> {
        this._addModalService.showAddModal();
    }
}
