import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { phoneNumberRegex, verificationCodeRegex } from '../constants/common';
import { AuthenticationService } from '../services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms ease-in-out')
            ])
        ])
    ]
})
export class LoginPage implements OnInit, OnDestroy {
    public user$ = this._authentiationService.user$;
    public awaitingVerificationCode$ = this._authentiationService
        .awaitingVerificationCode$;
    public recaptchaRendered$ = this._authentiationService.recaptchaRendered$;
    public submitting = false;

    public loginFormGroup: FormGroup;
    public phoneNumberRegex = phoneNumberRegex;
    public verificationCodeRegex = verificationCodeRegex;

    private _userSub: Subscription;

    constructor(
        private _authentiationService: AuthenticationService,
        private _router: Router,
        private _formBuilder: FormBuilder
    ) {
        this._userSub = this._authentiationService.user$.subscribe((user) => {
            if (
                !!user &&
                !!user.email &&
                !!user.phoneNumber &&
                !!user.firstName &&
                !!user.lastName
            ) {
                this._router.navigateByUrl('/tabs/home');
            } else if (!!user) {
                this._router.navigateByUrl('/register');
            }
        });
    }

    public ngOnDestroy(): void {
        this._userSub.unsubscribe();
    }

    public async ngOnInit(): Promise<void> {
        this.loginFormGroup = this._formBuilder.group({
            phoneNumber: [
                '',
                [Validators.required, Validators.pattern(phoneNumberRegex)]
            ],
            verificationCode: [
                '',
                [Validators.required, Validators.pattern(verificationCodeRegex)]
            ]
        });

        await this._authentiationService.initializeLogin();
    }

    public submitPhoneNumber(): void {
        this.phoneNumberFormControl.markAsTouched();
        if (this.phoneNumberFormControl.valid) {
            this.submitting = true;

            this._authentiationService.submitPhoneNumber(
                this.phoneNumberFormControl.value
            );
        }
    }

    public submitVerificationCode(): void {
        this.verificationCodeFormControl.markAsTouched();

        if (this.verificationCodeFormControl.valid) {
            this._authentiationService.submitVerificationCode(
                this.verificationCodeFormControl.value
            );
        }
    }

    public cancelVerificationCode(): void {
        this.verificationCodeFormControl.markAsUntouched();
        this.phoneNumberFormControl.markAsUntouched();

        this._authentiationService.cancelVerificationCode();
    }

    public get phoneNumberFormControl() {
        return this.loginFormGroup.get('phoneNumber');
    }
    public get verificationCodeFormControl() {
        return this.loginFormGroup.get('verificationCode');
    }
}
