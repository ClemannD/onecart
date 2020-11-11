import { Component } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { HouseholdService } from './services/household.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public household$ = this._householdService.household$;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private _authenticationService: AuthenticationService,
        private _householdService: HouseholdService,
        private _menuController: MenuController
    ) {
        this._initializeApp();
    }

    private _initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    public closeMenu(): void {
        this._menuController.close();
    }

    public signOut(): void {
        this._authenticationService.signOut();
        this._menuController.close();
    }
}
