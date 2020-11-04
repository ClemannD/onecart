import { Inject, Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { Household } from '../models/household.model';
import { AuthenticationService } from './authentication.service';
import { AbstractDataService } from './data-service/abstract-data.service';

@Injectable({ providedIn: 'root' })
export class HouseholdService {
    public household$ = this._dataService.household$;

    constructor(
        @Inject(AbstractDataService) private _dataService: AbstractDataService,
        private _authService: AuthenticationService
    ) {}

    public async saveHousehold(household: Household): Promise<void> {
        if (!household.householdKey) {
            household.householdKey = this._dataService.generateUid();
            household.householdCode = await this.generateRandomHouseholdCode();
            this._dataService.createHousehold(household);
            await this._authService.updateUser({
                refHouseholdKey: household.householdKey
            });
        } else {
            console.log('updated');

            this._dataService.updateHousehold(household);
        }
    }

    public async associateUserToHousehold(
        householdCode: string
    ): Promise<boolean> {
        const households = await this._dataService
            .getHouseholdByCode(householdCode)
            .pipe(first())
            .toPromise();

        console.log(households);

        if (households.length) {
            this._authService.updateUser({
                refHouseholdKey: households[0].householdKey
            });
            return true;
        }
        return false;
    }

    public async generateRandomHouseholdCode(): Promise<string> {
        let validCode;
        while (!validCode) {
            const possibleCode = this._generateCode();
            const households = await this._dataService
                .getHouseholdByCode(possibleCode)
                .pipe(first())
                .toPromise();

            if (!households.length) {
                validCode = possibleCode;
            }
        }
        return validCode;
    }

    private _generateCode(): string {
        return Math.round(Math.pow(36, 7) - Math.random() * Math.pow(36, 6))
            .toString(36)
            .slice(1)
            .toUpperCase();
    }
}
