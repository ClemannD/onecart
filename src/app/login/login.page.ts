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
    public allowPhoneLogin = false;
    public showPasswordLogin = true;

    public showCreateAccountForm = false;
    public showResetPasswordForm = false;

    public user$ = this._authentiationService.user$;
    public authenticationError$ = this._authentiationService
        .authenticationError$;
    public createAccountError$ = this._authentiationService.createAccountError$;
    public awaitingVerificationCode$ = this._authentiationService
        .awaitingVerificationCode$;
    public recaptchaRendered$ = this._authentiationService.recaptchaRendered$;
    public submitting = false;

    public phoneLoginFormGroup: FormGroup;
    public createAccountFormGroup: FormGroup;
    public passwordLoginFormGroup: FormGroup;
    public resetPasswordFormGroup: FormGroup;

    public phoneNumberRegex = phoneNumberRegex;
    public verificationCodeRegex = verificationCodeRegex;
    public authErrorType = AuthErrorType;

    public submittingPhoneNumber = false;
    public submittingCreateAccountForm = false;
    public submittingPasswordSignInForm = false;
    public submittingVerificationCode = false;
    public submittingResetPasswordByEmail = false;
    public submittedResetPasswordByEmail = false;

    private _authenticationErrorSub: Subscription;

    public passwordsDoNotMatch = false;

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
        this.phoneLoginFormGroup = this._formBuilder.group({
            phoneNumber: [
                '',
                [Validators.required, Validators.pattern(phoneNumberRegex)]
            ],
            verificationCode: [
                '',
                [Validators.required, Validators.pattern(verificationCodeRegex)]
            ]
        });

        this.createAccountFormGroup = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]]
        });
        this.passwordLoginFormGroup = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
        this.resetPasswordFormGroup = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

        // await this._authentiationService.initializeLogin();
    }

    public async signInWithGoogle(): Promise<void> {
        await this._authentiationService.signInWithGoogle();
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

    public async sendResetPasswordEmail(): Promise<void> {
        this.resetPasswordFormGroup.markAsTouched();
        if (this.resetPasswordFormGroup.valid) {
            this.submittingResetPasswordByEmail = true;

            await this._authentiationService.resetPasswordByEmail(
                this.resetPasswordEmailFormControl.value
            );
            this.submittingResetPasswordByEmail = false;
            this.submittedResetPasswordByEmail = true;
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

    public async submitCreateAccountForm(): Promise<void> {
        this.createAccountFormGroup.markAllAsTouched();

        if (this.createAccountFormGroup.valid) {
            if (
                this.createPasswordFormControl.value !==
                this.createConfirmPasswordFormControl.value
            ) {
                this.passwordsDoNotMatch = true;
            } else {
                this.submittingCreateAccountForm = true;

                await this._authentiationService.createAccount({
                    email: this.createEmailFormControl.value,
                    password: this.createPasswordFormControl.value
                });
                this.submittingCreateAccountForm = false;
            }
        }
    }

    public async submitPasswordLoginForm(): Promise<void> {
        this.passwordLoginFormGroup.markAllAsTouched();

        if (this.passwordLoginFormGroup.valid) {
            this.submittingPasswordSignInForm = true;
            await this._authentiationService.signInWithPassword({
                email: this.loginEmailFormControl.value,
                password: this.loginPasswordFormControl.value
            });
            this.submittingPasswordSignInForm = false;
        }
    }

    public get phoneNumberFormControl() {
        return this.phoneLoginFormGroup.get('phoneNumber');
    }
    public get verificationCodeFormControl() {
        return this.phoneLoginFormGroup.get('verificationCode');
    }

    public get createEmailFormControl() {
        return this.createAccountFormGroup.get('email');
    }
    public get createPasswordFormControl() {
        return this.createAccountFormGroup.get('password');
    }
    public get createConfirmPasswordFormControl() {
        return this.createAccountFormGroup.get('confirmPassword');
    }

    public get loginEmailFormControl() {
        return this.passwordLoginFormGroup.get('email');
    }
    public get loginPasswordFormControl() {
        return this.passwordLoginFormGroup.get('password');
    }

    public get resetPasswordEmailFormControl() {
        return this.resetPasswordFormGroup.get('email');
    }
}
