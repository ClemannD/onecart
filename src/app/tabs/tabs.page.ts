import { Component, Input, OnInit } from '@angular/core';
import { AddModalService } from './modals/add-modal.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
    public addMenuModal: HTMLIonModalElement;
    public addItemForCategoryModal: HTMLIonModalElement;
    public editItemModal: HTMLIonModalElement;
    public addCategoryModal: HTMLIonModalElement;

    constructor(private _addModalService: AddModalService) {}
    public ngOnInit(): void {}

    public async showAddModal(): Promise<void> {
        this._addModalService.showAddModal();
    }
}
