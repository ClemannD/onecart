import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { phoneNumberRegex } from '../constants/common';
import { AuthenticationService } from '../services/authentication.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in-out')
            ])
        ])
    ]
})
export class RegisterPage implements OnDestroy {
    public user$ = this._authentiationService.user$;

    public registrationFormGroup: FormGroup;
    public phoneNumberRegex = phoneNumberRegex;

    private _userSub: Subscription;

    constructor(
        private _authentiationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _router: Router
    ) {
        this.registrationFormGroup = this._formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required]]
        });

        this._userSub = this.user$.subscribe((user) => {
            this.registrationFormGroup.reset({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phoneNumber: user?.phoneNumber || ''
            });
        });
    }

    public ngOnDestroy(): void {
        this._userSub.unsubscribe();
    }

    public async submitRegistration(): Promise<void> {
        this.registrationFormGroup.markAllAsTouched();

        if (this.registrationFormGroup.valid) {
            const user = await this.user$.pipe(first()).toPromise();
            this._authentiationService.updateUser({
                ...user,
                firstName: this.firstNameFormControl.value,
                lastName: this.lastNameFormControl.value,
                email: this.emailFormControl.value,
                phoneNumber: this.phoneNumberFormControl.value
            });

            this._router.navigateByUrl('/household');
        }
    }

    public get firstNameFormControl() {
        return this.registrationFormGroup.get('firstName');
    }
    public get lastNameFormControl() {
        return this.registrationFormGroup.get('lastName');
    }
    public get emailFormControl() {
        return this.registrationFormGroup.get('email');
    }
    public get phoneNumberFormControl() {
        return this.registrationFormGroup.get('phoneNumber');
    }

    public signOut(): void {
        this._authentiationService.signOut();
    }
}
