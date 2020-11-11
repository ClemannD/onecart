import { forwardRef, Self } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
    selector: 'app-select',
    template: `
        <div class="app-input">
            <ion-label position="stacked">{{ inputLabel }}</ion-label>
            <ion-select
                [class]="{
                    disabled: disabled,
                    'has-value': !!formControl?.value
                }"
                [placeholder]="placeholder"
                [interface]="interface"
                [(ngModel)]="value"
                [disabled]="disabled"
                (ionBlur)="blured = true"
                [interfaceOptions]="{ cssClass: 'select-wider-popover' }"
            >
                <ion-select-option
                    *ngFor="let option of options"
                    [value]="option.value"
                >
                    {{ option.label }}
                </ion-select-option>
            </ion-select>
            <div
                class="input-error"
                *ngIf="
                    formControl?.invalid &&
                    (blured || formControl?.errors?.required) &&
                    (formControl?.dirty || formControl?.touched)
                "
            >
                <ng-content></ng-content>
            </div>
        </div>
    `,
    styleUrls: ['./select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true
        }
    ]
})
export class SelectComponent implements ControlValueAccessor {
    @Input() public options: any[];
    @Input() public name: string;
    @Input() public formControl: FormControl;
    @Input() public autocomplete: string;
    @Input() public placeholder: string;
    @Input() public inputLabel: string;
    @Input() public interface = 'popover';
    @Input() public disabled = false;
    @Input('value') _value = '';

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
