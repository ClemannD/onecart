import { Component, Inject } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { HouseholdService } from './services/household.service';
import smoothscroll from 'smoothscroll-polyfill';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AbstractDataService } from './services/data-service/abstract-data.service';
import { Observable } from 'rxjs';
import { Household } from './models/household.model';

// kick off the polyfill!
smoothscroll.polyfill();

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public household$: Observable<Household>;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private _authenticationService: AuthenticationService,
        private _householdService: HouseholdService,
        private _menuController: MenuController,
        @Inject(AbstractDataService) private _dataService: AbstractDataService,
        private _router: Router
    ) {
        this._initializeApp();
    }

    private _initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this._dataService.initializeApp();
            this._householdService.initialize();
            this.household$ = this._householdService.household$;
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
