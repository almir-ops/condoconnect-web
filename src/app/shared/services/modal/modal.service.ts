import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DynamicFormModalComponent } from '../../components/dynamic-form-modal/dynamic-form-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalCtrl: ModalController) {}

  async openFormModal(formConfig: any, onSubmit: (values: any) => void) {
    const modal = await this.modalCtrl.create({
      component: DynamicFormModalComponent,
      componentProps: { formConfig, onSubmit },
      cssClass: 'custom-modal'
    });

    return null
  }
}
