import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AbstractAuthDataService } from './data-service/abstract-auth-data.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public user$: Observable<User>;
    public authenticationError$ = this._authDataService.authenticationError$;
    public createAccountError$ = this._authDataService.createAccountError$;

    public awaitingVerificationCode$ = this._authDataService
        .awaitingVerificationCode$;
    public recaptchaRendered$ = this._authDataService.recaptchaRendered$;

    private _isLoggingInSubject = new BehaviorSubject<boolean>(false);
    public isLoggingIn$ = this._isLoggingInSubject.asObservable();

    constructor(
        @Inject(AbstractAuthDataService)
        private _authDataService: AbstractAuthDataService,
        private _router: Router
    ) {}

    public initalizeApp(): void {
        this._authDataService.initializeApp();
        this.user$ = this._authDataService.user$;
        combineLatest([this.user$, this.isLoggingIn$])
            .pipe(filter(([user, isLoggingIn]) => isLoggingIn && !!user))
            .subscribe((_) => {
                this._router.navigateByUrl('/tabs/home');
            });
    }
    public async initializeLogin(): Promise<void> {
        await this._authDataService.initializeLogin();
    }

    public async signInWithGoogle(): Promise<void> {
        await this._authDataService.signInWithGoogle();
    }
    public async signInWithPassword(credentials): Promise<void> {
        this._isLoggingInSubject.next(true);
        await this._authDataService.signInWithPassword(credentials);
    }
    public async resetPasswordByEmail(email: string): Promise<void> {
        await this._authDataService.resetPasswordByEmail(email);
    }

    public async createAccount(credentials): Promise<void> {
        this._isLoggingInSubject.next(true);
        await this._authDataService.createAccount(credentials);
    }

    public submitPhoneNumber(phoneNumber: string): void {
        this._authDataService.submitPhoneNumber(phoneNumber);
    }

    public cancelVerificationCode(): void {
        this._authDataService.cancelPhoneNumber();
    }

    public submitVerificationCode(verificationCode: string): void {
        this._isLoggingInSubject.next(true);
        this._authDataService.submitPhoneVerificationCode(verificationCode);
    }

    public async updateUser(userUpdates: User): Promise<void> {
        const user = await this.user$.pipe(first()).toPromise();
        await this._authDataService.updateUser({
            ...user,
            ...userUpdates
        });
    }

    public async signOut(): Promise<void> {
        await this._authDataService.signOut();
    }
}
