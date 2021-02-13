import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';

export enum AuthErrorType {
    InvalidCode = 1,
    InvalidPassword = 2,
    EmailExists = 3,
    EmailNotFound = 4,
    WeakPassword = 5,
    GenericCreateError = 6,
    GenericLoginError = 7
}

@Injectable()
export class AbstractAuthDataService {
    public user$: Observable<User>;
    public awaitingVerificationCode$: Observable<boolean>;
    public recaptchaRendered$: Observable<boolean>;
    public authenticationError$: Observable<AuthErrorType>;
    public createAccountError$: Observable<AuthErrorType>;

    constructor() {}

    public initializeApp: () => void;
    public initializeLogin: () => Promise<void>;
    public signOut: () => void;

    public signInWithGoogle: () => void;
    public resetPasswordByEmail: (email: string) => Promise<void>;
    public createAccount: (credentials: {
        email: string;
        password: string;
    }) => Promise<void>;
    public signInWithPassword: (credentials: {
        email: string;
        password: string;
    }) => Promise<void>;
    public submitPhoneNumber: (phoneNumber: string) => void;
    public cancelPhoneNumber: () => void;
    public submitPhoneVerificationCode: (verificationCode: string) => void;
    public updateUser: (user: User) => void;
}
