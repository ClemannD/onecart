import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AddModalService } from './modals/add-modal.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    public addMenuModal: HTMLIonModalElement;
    public addItemForCategoryModal: HTMLIonModalElement;
    public editItemModal: HTMLIonModalElement;
    public addCategoryModal: HTMLIonModalElement;

    constructor(
        private _addModalService: AddModalService,
        private _menuController: MenuController
    ) {}

    public async showAddModal(): Promise<void> {
        this._addModalService.showAddModal();
    }

    public showMenu(): void {
        this._menuController.open('side-menu');
    }
}
