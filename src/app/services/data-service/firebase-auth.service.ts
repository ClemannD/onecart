import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { WindowService } from '../window.service';
import {
    AbstractAuthDataService,
    AuthErrorType
} from './abstract-auth-data.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class FirebaseAuthService implements AbstractAuthDataService {
    private _usersCollection = this._angularFirestore.collection<User>('users');
    private _recaptchaRenderedSubject = new BehaviorSubject<boolean>(false);
    public recaptchaRendered$ = this._recaptchaRenderedSubject.asObservable();

    private _authenticationErrorSubject = new BehaviorSubject<AuthErrorType>(
        null
    );
    public authenticationError$ = this._authenticationErrorSubject.asObservable();

    private _awaitingVerificationCodeSubject = new BehaviorSubject<boolean>(
        false
    );
    public awaitingVerificationCode$ = this._awaitingVerificationCodeSubject.asObservable();

    public user$ = this._angularFireAuth.authState.pipe(
        switchMap((firebaseUser) => {
            return firebaseUser
                ? this._angularFirestore
                      .collection<User>('users', (ref) =>
                          ref.where('userKey', '==', firebaseUser.uid)
                      )
                      .valueChanges()
                      .pipe(map((users) => users[0] || null))
                : of(null);
        })
    );

    constructor(
        private _windowService: WindowService,
        private _angularFireAuth: AngularFireAuth,
        private _angularFirestore: AngularFirestore,
        private _router: Router
    ) {}

    public async initializeLogin(): Promise<void> {
        this._windowService.nativeWindow.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            'recaptcha-container'
        );

        const widgetId = await this._windowService.nativeWindow.recaptchaVerifier.render();
        this._recaptchaRenderedSubject.next(true);

        this._windowService.nativeWindow.recaptchaWidgetId = widgetId;
    }

    public signOut(): void {
        this._angularFireAuth.signOut();
        this._router.navigateByUrl('/login');
    }

    public submitPhoneNumber(phoneNumber: string): void {
        this._angularFireAuth
            .signInWithPhoneNumber(
                `+1${phoneNumber}`,
                this._windowService.nativeWindow.recaptchaVerifier
            )
            .then((confirmationResult) => {
                this._windowService.nativeWindow.confirmationResult = confirmationResult;
                this._awaitingVerificationCodeSubject.next(true);
            })
            .catch((error) => {
                console.log('Error sending verification code', error);
            });
    }

    public cancelPhoneNumber(): void {
        this._awaitingVerificationCodeSubject.next(false);
    }

    public submitPhoneVerificationCode(verificationCode: string): void {
        this._windowService.nativeWindow.confirmationResult
            .confirm(verificationCode)
            .then((result) => {
                this._awaitingVerificationCodeSubject.next(false);
                this._loginUserByPhoneNumber(result.user);
            })
            .catch((error) => {
                console.log('Verification Error', error);
                this._authenticationErrorSubject.next(
                    AuthErrorType.InvalidCode
                );
            });
    }

    public updateUser(user: User): void {
        this._usersCollection.doc(user.userKey).set(user);
    }

    private async _loginUserByPhoneNumber(
        firebaseUser: firebase.User
    ): Promise<void> {
        const user = (
            await this._angularFirestore
                .collection<User>('users', (ref) =>
                    ref.where('phoneNumber', '==', firebaseUser.phoneNumber)
                )
                .valueChanges()
                .pipe(first())
                .toPromise()
        )[0];

        if (!user) {
            const newUser = {
                userKey: firebaseUser.uid,
                phoneNumber: firebaseUser.phoneNumber
            };
            this._usersCollection.doc<User>(firebaseUser.uid).set(newUser);
        }
        this._router.navigateByUrl('/tabs/home');
    }
}
