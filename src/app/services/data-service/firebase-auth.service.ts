import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, pipe, ReplaySubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { WindowService } from '../window.service';
import {
    AbstractAuthDataService,
    AuthErrorType
} from './abstract-auth-data.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map, shareReplay, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { cfaSignIn } from 'capacitor-firebase-auth';

@Injectable()
export class FirebaseAuthService implements AbstractAuthDataService {
    private _usersCollection = this._angularFirestore.collection<User>('users');
    private _recaptchaRenderedSubject = new BehaviorSubject<boolean>(false);
    public recaptchaRendered$ = this._recaptchaRenderedSubject.asObservable();

    private _authenticationErrorSubject = new BehaviorSubject<AuthErrorType>(
        null
    );
    public authenticationError$ = this._authenticationErrorSubject.asObservable();
    private _createAccountErrorSubject = new BehaviorSubject<AuthErrorType>(
        null
    );
    public createAccountError$ = this._createAccountErrorSubject.asObservable();

    private _awaitingVerificationCodeSubject = new BehaviorSubject<boolean>(
        false
    );
    public awaitingVerificationCode$ = this._awaitingVerificationCodeSubject.asObservable();

    private _firebaseUserSubject = new ReplaySubject<firebase.User>();
    public user$ = this._firebaseUserSubject.asObservable().pipe(
        switchMap((firebaseUser) => {
            return firebaseUser
                ? this._angularFirestore
                      .collection<User>('users', (ref) =>
                          ref.where('userKey', '==', firebaseUser.uid)
                      )
                      .valueChanges()
                      .pipe(map((users) => users[0] || null))
                : of(null);
        }),
        shareReplay(1)
    );

    constructor(
        private _windowService: WindowService,
        private _angularFireAuth: AngularFireAuth,
        private _angularFirestore: AngularFirestore,
        private _router: Router
    ) {}

    public initializeApp(): void {
        firebase.auth().onAuthStateChanged((firebaseUser) => {
            this._firebaseUserSubject.next(firebaseUser);
        });
    }

    public async initializeLogin(): Promise<void> {
        this._windowService.nativeWindow.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            'recaptcha-container'
        );

        const widgetId = await this._windowService.nativeWindow.recaptchaVerifier.render();
        this._recaptchaRenderedSubject.next(true);

        this._windowService.nativeWindow.recaptchaWidgetId = widgetId;
    }

    public async createAccount(credentials: {
        email: string;
        password: string;
    }): Promise<void> {
        try {
            const firebaseCredential = await this._angularFireAuth.createUserWithEmailAndPassword(
                credentials.email,
                credentials.password
            );
            await this._loginUserByEmail(
                (firebaseCredential as firebase.auth.UserCredential).user
            );
        } catch (error) {
            if (error.code === 'auth/weak-password') {
                this._createAccountErrorSubject.next(
                    AuthErrorType.WeakPassword
                );
            } else if (error.code === 'auth/email-already-in-use') {
                this._createAccountErrorSubject.next(AuthErrorType.EmailExists);
            } else {
                this._createAccountErrorSubject.next(
                    AuthErrorType.GenericCreateError
                );
            }
        }
    }

    public async updateUser(user: User): Promise<void> {
        await this._usersCollection.doc(user.userKey).set(user);
    }

    public async signInWithPassword(credentials: {
        email: string;
        password: string;
    }): Promise<void> {
        try {
            const firebaseCredential = await this._angularFireAuth.signInWithEmailAndPassword(
                credentials.email,
                credentials.password
            );
            await this._loginUserByEmail(
                (firebaseCredential as firebase.auth.UserCredential).user
            );
            this._router.navigateByUrl('/');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                this._authenticationErrorSubject.next(
                    AuthErrorType.EmailNotFound
                );
            } else if (error.code === 'auth/wrong-password') {
                this._authenticationErrorSubject.next(
                    AuthErrorType.InvalidPassword
                );
            } else {
                this._authenticationErrorSubject.next(
                    AuthErrorType.GenericLoginError
                );
            }
        }
    }

    public async resetPasswordByEmail(email: string): Promise<void> {
        await this._angularFireAuth.sendPasswordResetEmail(email);
    }

    public async signInWithGoogle(): Promise<void> {
        const firebaseUser = await cfaSignIn('google.com').toPromise();
        return this._loginUserByEmail(firebaseUser);
    }

    public async signOut(): Promise<void> {
        await this._angularFireAuth.signOut();
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

    private async _loginUserByEmail(
        firebaseUser: firebase.User
    ): Promise<void> {
        const user = (
            await this._angularFirestore
                .collection<User>('users', (ref) =>
                    ref.where('email', '==', firebaseUser.email)
                )
                .valueChanges()
                .pipe(first())
                .toPromise()
        )[0];

        if (!user) {
            const newUser = {
                userKey: firebaseUser.uid,
                email: firebaseUser.email
            };
            await this._usersCollection
                .doc<User>(firebaseUser.uid)
                .set(newUser);
        }
        this._firebaseUserSubject.next(firebaseUser);

        await this._router.navigateByUrl('/tabs/home');
    }
}
