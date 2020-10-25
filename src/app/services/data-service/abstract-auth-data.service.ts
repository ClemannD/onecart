import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Injectable()
export class AbstractAuthDataService {
    public user$: Observable<User>;
    public awaitingVerificationCode$: Observable<boolean>;
    public recaptchaRendered$: Observable<boolean>;

    constructor() {}

    public initializeLogin: () => Promise<void>;
    public signOut: () => void;

    public submitPhoneNumber: (phoneNumber: string) => void;
    public cancelPhoneNumber: () => void;
    public submitPhoneVerificationCode: (verificationCode: string) => void;
    public updateUser: (user: User) => void;
}
