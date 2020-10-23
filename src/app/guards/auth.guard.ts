import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private _authenticationService: AuthenticationService,
        private _router: Router
    ) {}

    public canActivate(): boolean {
        const isAuthenticated = this._authenticationService.isAuthenticated();

        console.log(isAuthenticated);

        if (isAuthenticated) {
            return true;
        } else {
            this._router.navigate(['./login']);
            return false;
        }
    }
}
