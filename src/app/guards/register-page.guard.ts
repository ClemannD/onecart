import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class RegisterPageGuard implements CanActivate {
    constructor(
        private _authenticationService: AuthenticationService,
        private _router: Router
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._authenticationService.user$.pipe(
            map((user) => {
                if (
                    !!user &&
                    !!user.email &&
                    !!user.phoneNumber &&
                    !!user.firstName &&
                    !!user.lastName &&
                    !!user.refHouseholdKey
                ) {
                    return this._router.createUrlTree(['./tabs/household']);
                } else if (
                    !!user &&
                    !!user.email &&
                    !!user.phoneNumber &&
                    !!user.firstName &&
                    !!user.lastName
                ) {
                    return this._router.createUrlTree(['./household']);
                } else if (!!user) {
                    return true;
                }
                return this._router.createUrlTree(['./login']);
            })
        );
    }
}
