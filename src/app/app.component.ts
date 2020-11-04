import { Component, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy {
    private _userSub: Subscription;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private _authentiationService: AuthenticationService,
        private _router: Router
    ) {
        this._initializeApp();
    }

    public ngOnDestroy(): void {
        this._userSub.unsubscribe();
    }

    private _initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });

        this._userSub = this._authentiationService.user$.subscribe((user) => {
            if (
                !!user &&
                (!user.email ||
                    !user.phoneNumber ||
                    !user.firstName ||
                    !user.lastName)
            ) {
                this._router.navigateByUrl('/register');
            } else if (!!user && !user.refHouseholdKey) {
                this._router.navigateByUrl('/household');
            }
        });
    }
}
