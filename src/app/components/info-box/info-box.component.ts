import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'info-box',
    styleUrls: ['./info-box.component.scss'],
    encapsulation: ViewEncapsulation.None,
    template: `
        <ion-card class="info-box">
            <ng-content></ng-content>
        </ion-card>
    `
})
export class InfoBoxComponent {}
