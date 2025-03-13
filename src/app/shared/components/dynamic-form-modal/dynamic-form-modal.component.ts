import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dynamic-form-modal',
  standalone: true,
  imports: [IonicModule,FormsModule],
  templateUrl: './dynamic-form-modal.component.html',
  styleUrls: ['./dynamic-form-modal.component.scss']
})
export class DynamicFormModalComponent {
  @Input() formConfig: any;
  @Input() onSubmit!: (values: any) => void;
  formValues: any = {};

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    // Inicializa os valores do formulário
    this.formValues = this.formConfig.reduce((acc: any, field: any) => {
      acc[field.name] = field.value || '';
      return acc;
    }, {});
  }

  close() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.onSubmit(this.formValues);
    this.modalCtrl.dismiss();
  }
}
