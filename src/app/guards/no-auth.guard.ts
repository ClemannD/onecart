import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
    constructor(
        private _authenticationService: AuthenticationService,
        private _router: Router
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        // return this._authenticationService.isFullyRegistered$.pipe(
        //     map((isRegistered) => {
        //         console.log(isRegistered);

        //         return isRegistered
        //             ? this._router.createUrlTree(['./tabs/home'])
        //             : true;
        //     })
        // );

        return this._authenticationService.user$.pipe(
            map((user) => {
                console.log(user);

                if (
                    !!user &&
                    !!user.email &&
                    !!user.phoneNumber &&
                    !!user.firstName &&
                    !!user.lastName
                ) {
                    return this._router.createUrlTree(['./tabs/home']);
                } else if (!!user) {
                    return this._router.createUrlTree(['./register']);
                }
                return true;
            })
        );
    }
}
