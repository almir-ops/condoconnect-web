import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingInstance: HTMLIonLoadingElement | null = null;
  private requestCount = 0;
  private isLoading = false; // Nova flag para impedir chamadas duplicadas

  constructor(private loadingCtrl: LoadingController) {}

  async showLoading() {
    this.requestCount++;

    // Apenas exibe o loading se não estiver visível
    if (!this.isLoading) {
      this.isLoading = true;
      this.loadingInstance = await this.loadingCtrl.create({
        message: 'Carregando...',
        spinner: 'crescent',
      });

      await this.loadingInstance.present();
    }
  }

  async hideLoading() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }

    // Apenas remove o loading se todas as requisições forem finalizadas
    if (this.requestCount === 0 && this.loadingInstance) {
      await this.loadingInstance.dismiss();
      this.loadingInstance = null;
      this.isLoading = false; // Reseta a flag
    }
  }
}
