import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-button',
    styleUrls: ['./button.component.scss'],
    template: `
        <ion-button
            [class]="[color, fill]"
            [expand]="isBlock ? 'block' : ''"
            [type]="type"
            [size]="size"
            [fill]="fill"
            [disabled]="disabled || submitting"
            (click)="handleButtonClick()"
        >
            <ion-spinner *ngIf="submitting" name="lines-small"></ion-spinner>
            <ng-content *ngIf="!submitting"></ng-content>
        </ion-button>
    `
})
export class ButtonComponent {
    @Input() public submitting = false;
    @Input() public disabled = false;
    @Input() public isBlock = true;
    @Input() public size: 'small' | 'large';
    @Input() public fill: 'solid' | 'outline' | 'clear' = 'solid';
    @Input() public type = 'button';
    @Input() public color: 'primary' | 'white' | 'secondary' | 'danger' =
        'primary';
    @Output() public buttonClick = new EventEmitter();

    public handleButtonClick(): void {
        this.buttonClick.emit();
    }
}
