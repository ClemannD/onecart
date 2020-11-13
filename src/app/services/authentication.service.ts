import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AbstractAuthDataService } from './data-service/abstract-auth-data.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public user$ = this._authDataService.user$;
    public authenticationError$ = this._authDataService.authenticationError$;

    public awaitingVerificationCode$ = this._authDataService
        .awaitingVerificationCode$;
    public recaptchaRendered$ = this._authDataService.recaptchaRendered$;

    constructor(
        @Inject(AbstractAuthDataService)
        private _authDataService: AbstractAuthDataService
    ) {}

    public async initializeLogin(): Promise<void> {
        await this._authDataService.initializeLogin();
    }

    public submitPhoneNumber(phoneNumber: string): void {
        this._authDataService.submitPhoneNumber(phoneNumber);
    }

    public cancelVerificationCode(): void {
        this._authDataService.cancelPhoneNumber();
    }

    public submitVerificationCode(verificationCode: string): void {
        this._authDataService.submitPhoneVerificationCode(verificationCode);
    }

    public async updateUser(userUpdates: User): Promise<void> {
        const user = await this.user$.pipe(first()).toPromise();
        await this._authDataService.updateUser({
            ...user,
            ...userUpdates
        });
    }

    public signOut(): void {
        return this._authDataService.signOut();
    }
}
