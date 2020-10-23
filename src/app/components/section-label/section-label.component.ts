import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'section-label',
    styleUrls: ['./section-label.component.scss'],
    template: `
        <div class="section-label">
            <span class="label">{{ label }}</span>
            <ion-icon name="ellipse"></ion-icon>
            <span class="count" *ngIf="count">({{ count }})</span>
        </div>
    `
})
export class SectionLabelComponent implements OnInit {
    @Input() public label: string;
    @Input() public count: number;

    constructor() {}

    ngOnInit() {}
}
