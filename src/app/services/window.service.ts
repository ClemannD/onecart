import { Injectable } from '@angular/core';

// This interface is optional, showing how you can add strong typings for custom globals.
// Just use "Window" as the type if you don't have custom global stuff
export interface ICustomWindow extends Window {
    // __custom_global_stuff: string;'
    recaptchaVerifier: any;
    confirmationResult: any;
    recaptchaWidgetId: any;
    recaptchaRendered: any;
}

function getWindow(): any {
    return window;
}

@Injectable()
export class WindowService {
    get nativeWindow(): ICustomWindow {
        return getWindow();
    }
}
