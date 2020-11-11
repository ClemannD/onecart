import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { phoneNumberRegex, verificationCodeRegex } from '../constants/common';
import { AuthenticationService } from '../services/authentication.service';
import { AuthErrorType } from '../services/data-service/abstract-auth-data.service';

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
    public authenticationError$ = this._authentiationService
        .authenticationError$;
    public awaitingVerificationCode$ = this._authentiationService
        .awaitingVerificationCode$;
    public recaptchaRendered$ = this._authentiationService.recaptchaRendered$;
    public submitting = false;

    public loginFormGroup: FormGroup;

    public phoneNumberRegex = phoneNumberRegex;
    public verificationCodeRegex = verificationCodeRegex;
    public authErrorType = AuthErrorType;

    public submittingPhoneNumber = false;
    public submittingVerificationCode = false;

    private _authenticationErrorSub: Subscription;

    constructor(
        private _authentiationService: AuthenticationService,
        private _formBuilder: FormBuilder
    ) {
        this._authenticationErrorSub = this.authenticationError$.subscribe(
            (error) => {
                if (error) {
                    this.submittingVerificationCode = false;
                }
            }
        );
    }

    public ngOnDestroy(): void {
        this._authenticationErrorSub.unsubscribe();
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
            this.submittingPhoneNumber = true;

            this._authentiationService.submitPhoneNumber(
                this.phoneNumberFormControl.value
            );
        }
    }

    public submitVerificationCode(): void {
        this.verificationCodeFormControl.markAsTouched();

        const sub = this.authenticationError$.subscribe((error) => {
            if (error) {
                this.submittingVerificationCode = false;
            }
        });
        if (this.verificationCodeFormControl.valid) {
            this.submittingVerificationCode = true;
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
