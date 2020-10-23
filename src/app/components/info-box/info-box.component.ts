import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'info-box',
    styleUrls: ['./info-box.component.scss'],
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="info-box">
            <ng-content></ng-content>
        </div>
    `
})
export class InfoBoxComponent {}
