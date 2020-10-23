import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private _userSubject = new BehaviorSubject<User>(null);
    public user$ = this._userSubject.asObservable();

    private _awaitingVerificationCodeSubject = new BehaviorSubject<boolean>(
        false
    );
    public awaitingVerificationCode$ = this._awaitingVerificationCodeSubject.asObservable();

    constructor(private _router: Router) {
        this.setUser({
            userKey: 'mockKey',
            firstName: 'Dylan',
            lastName: 'Clemann',
            phone: '9415807122'
        });
    }

    public submitPhoneNumber(phoneNumber: string): void {
        this._awaitingVerificationCodeSubject.next(true);
    }

    public cancelVerificationCode(): void {
        this._awaitingVerificationCodeSubject.next(false);
    }

    public submitVerificationCode(verificationCode: string): void {
        console.log(`${verificationCode} submitted to login`);

        this.setUser({
            userKey: 'mockKey',
            firstName: 'Dylan',
            lastName: 'Clemann',
            phone: '9415807122'
        });
    }

    public setUser(user: User): void {
        this._userSubject.next(user);
        this._router.navigateByUrl('/');
    }

    public isAuthenticated(): boolean {
        return !!this._userSubject.getValue();
    }
}
