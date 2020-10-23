import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in-out')
            ])
        ])
    ]
})
export class LoginPage implements OnInit {
    public phoneNumberRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    public verificationCodeRegex = /^[0-9]{6,6}$/;

    public awaitingVerificationCode$ = this._authentiationService
        .awaitingVerificationCode$;

    public loginFormGroup: FormGroup;

    constructor(
        private _authentiationService: AuthenticationService,
        private _formBuilder: FormBuilder
    ) {
        this.loginFormGroup = this._formBuilder.group({
            phoneNumber: [
                '',
                [Validators.required, Validators.pattern(this.phoneNumberRegex)]
            ],
            verificationCode: [
                '',
                [
                    Validators.required,
                    Validators.pattern(this.verificationCodeRegex)
                ]
            ]
        });

        this.loginFormGroup.valueChanges.subscribe((_) => {
            console.log(_);
        });
    }

    public ngOnInit(): void {
        this._authentiationService.user$.subscribe((_) => {
            console.log(_);
        });
    }

    public submitPhoneNumber(): void {
        this.phoneNumberFormControl.markAsTouched();
        if (this.phoneNumberFormControl.invalid) {
            return;
        }

        this._authentiationService.submitPhoneNumber(
            this.phoneNumberFormControl.value
        );
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
