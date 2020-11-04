import { EventEmitter, forwardRef, Output, Self } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
    selector: 'app-input',
    template: `
        <div class="app-input" [class.light-mode]="lightMode">
            <ion-label position="stacked">{{ inputLabel }}</ion-label>
            <ion-input
                [class]="{ disabled: disabled }"
                [type]="type"
                [inputmode]="inputMode"
                [autocomplete]="autocomplete"
                [maxlength]="maxlength"
                [placeholder]="placeholder"
                [(ngModel)]="value"
                [pattern]="pattern"
                [disabled]="disabled"
                [autocapitalize]="autocapitalize ? 'on' : 'off'"
                (ionBlur)="blured = true"
                (ionFocus)="focus.emit()"
            ></ion-input>
            <div
                class="input-error"
                *ngIf="
                    formControl?.invalid &&
                    (blured || formControl.errors?.required) &&
                    (formControl.dirty || formControl.touched)
                "
            >
                <ng-content></ng-content>
            </div>
        </div>
    `,
    styleUrls: ['./input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ]
})
export class InputComponent implements ControlValueAccessor {
    @Input() public name: string;
    @Input() public formControl: FormControl;
    @Input() public type = 'text';
    @Input() public inputMode = 'text';
    @Input() public autocomplete: string;
    @Input() public pattern: string;
    @Input() public maxlength: number;
    @Input() public placeholder: string;
    @Input() public autocapitalize = false;
    @Input() public inputLabel: string;
    @Input() public disabled = false;
    @Input() public lightMode = false;
    @Input('value') _value = '';
    @Output() public focus = new EventEmitter();

    public blured = false;

    onChange: any = () => {};
    onTouched: any = () => {};

    constructor() {}

    public get value() {
        return this._value;
    }

    public set value(val) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    writeValue(value) {
        if (value) {
            this.value = value;
        }
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }
}
