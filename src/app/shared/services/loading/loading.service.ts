import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../../components/loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private requestCount = 0;
  private isLoading = false;
  private loadingDialogRef: any = null; // Armazena o modal de loading

  constructor(private dialog: MatDialog) {}

  showLoading(): void {
    this.requestCount++;

    if (!this.isLoading) {
      this.isLoading = true;
      this.loadingDialogRef = this.dialog.open(LoadingComponent, {
        disableClose: true,
        panelClass: 'loading-dialog',
      });
    }
  }

  hideLoading(): void {
    if (this.requestCount > 0) {
      this.requestCount--;
    }

    if (this.requestCount === 0 && this.isLoading) {
      if (this.loadingDialogRef) {
        this.loadingDialogRef.close(); // Fecha apenas o modal de loading
        this.loadingDialogRef = null;
      }
      this.isLoading = false;
    }
  }



}
