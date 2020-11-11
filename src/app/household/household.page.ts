import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { HouseholdService } from '../services/household.service';
import { AddModalService } from '../tabs/modals/add-modal.service';

enum HouseholdPageState {
    Unselected = 0,
    NewHoushold = 1,
    JoinHousehold = 2
}

@Component({
    selector: 'app-household',
    templateUrl: './household.page.html',
    styleUrls: ['./household.page.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in-out')
            ])
        ])
    ]
})
export class HouseholdPage implements OnInit, OnDestroy {
    public currentState = HouseholdPageState.Unselected;
    public householdPageState = HouseholdPageState;

    public newHouseholdFormSubmtting = false;
    public newHouseholdFormGroup: FormGroup;
    public joinHouseholdFormSubmtting = false;
    public joinHouseholdFormGroup: FormGroup;
    public joinHouseholdCodeCurrentValue = '';

    private _inputChangesSub: Subscription;

    constructor(
        private _authenticationService: AuthenticationService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _householdService: HouseholdService
    ) {}

    public ngOnInit(): void {
        this.newHouseholdFormGroup = this._formBuilder.group({
            householdName: ['', [Validators.required, Validators.maxLength(30)]]
        });
        this.joinHouseholdFormGroup = this._formBuilder.group({
            householdCode: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(6),
                    Validators.minLength(6)
                ]
            ]
        });

        this._inputChangesSub = this.joinHouseholdCodeFormControl.valueChanges
            .pipe(
                filter((value) => {
                    return value !== this.joinHouseholdCodeCurrentValue;
                })
            )
            .subscribe((value) => {
                this.joinHouseholdCodeCurrentValue = value.toUpperCase();
                this.joinHouseholdCodeFormControl.setValue(
                    this.joinHouseholdCodeCurrentValue
                );
            });
    }

    public ngOnDestroy(): void {
        this._inputChangesSub.unsubscribe();
    }

    public async handleNewHouseholdSubmit(): Promise<void> {
        this.newHouseholdFormGroup.markAllAsTouched();

        if (this.newHouseholdFormGroup.valid) {
            this.newHouseholdFormSubmtting = true;
            await this._householdService.saveHousehold({
                householdName: this.newHouseholdNameFormControl.value
            });
            this.newHouseholdFormSubmtting = false;
            this._router.navigateByUrl('/');
        }
    }

    public async handleJoinHouseholdSubmit(): Promise<void> {
        this.joinHouseholdFormGroup.markAllAsTouched();
        console.log(this.joinHouseholdFormGroup);

        if (this.joinHouseholdFormGroup.valid) {
            this.joinHouseholdFormSubmtting = true;

            const householdFound = await this._householdService.associateUserToHousehold(
                this.joinHouseholdCodeFormControl.value
            );

            console.log(householdFound);

            if (!householdFound) {
                this.joinHouseholdCodeFormControl.setErrors({
                    notFound: true
                });
                this.joinHouseholdFormSubmtting = false;
            } else {
                this._router.navigateByUrl('/tabs/home');
            }
        }
    }

    public signOut(): void {
        this._authenticationService.signOut();
    }

    public get newHouseholdNameFormControl() {
        return this.newHouseholdFormGroup.get('householdName');
    }
    public get joinHouseholdCodeFormControl() {
        return this.joinHouseholdFormGroup.get('householdCode');
    }
}
