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
            [disabled]="disabled"
            (click)="handleButtonClick()"
        >
            <ng-content></ng-content>
        </ion-button>
    `
})
export class ButtonComponent {
    @Input() public disabled = false;
    @Input() public isBlock = true;
    @Input() public size: 'small' | 'large';
    @Input() public fill: 'solid' | 'outline' | 'clear' = 'solid';
    @Input() public type = 'button';
    @Input() public color = 'primary';
    @Output() public buttonClick = new EventEmitter();

    public handleButtonClick(): void {
        this.buttonClick.emit();
    }
}
