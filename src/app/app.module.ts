import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractDataService } from './services/data-service/abstract-data.service';
import { FirestoreService } from './services/data-service/firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { WindowService } from './services/window.service';
import { AbstractAuthDataService } from './services/data-service/abstract-auth-data.service';
import { FirebaseAuthService } from './services/data-service/firebase-auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        IonicModule.forRoot({
            mode: 'ios'
        }),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule
    ],
    providers: [
        WindowService,
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        AuthGuard,
        NoAuthGuard,
        AngularFirestore,
        {
            provide: AbstractDataService,
            useClass: FirestoreService
        },
        {
            provide: AbstractAuthDataService,
            useClass: FirebaseAuthService
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
