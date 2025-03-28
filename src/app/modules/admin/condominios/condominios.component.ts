import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CondominiosService } from '../../../shared/services/condominios/condominios.service';
import { ModalCondominioComponent } from '../../../shared/components/modais/modal-condominio/modal-condominio.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../shared/components/dialog/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalConfirmDialogComponent } from '../../../shared/components/modais/modal-confirm-dialog/modal-confirm-dialog.component';
import { CepService } from '../../../shared/services/cep/cep.service';

@Component({
  selector: 'app-condominios',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './condominios.component.html',
  styleUrl: './condominios.component.scss'
})
export class CondominiosComponent implements OnInit {

  columns = ['nome', 'telefone','endereco', 'cidade', 'estado', 'esta_ativo' ];
  data = [];

  constructor(
    private condominiosService:CondominiosService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private _snackBar: MatSnackBar,
    private cepService: CepService
  ){

  }

  ngOnInit(): void {
    this.getCondominios()
  }

  getCondominios(){
    this.condominiosService.getAllEstablishments().subscribe({
      next:(value:any)=> {
        console.log(value);
        this.data = value
      },
    })
  }

  handleButtonClick = () => {
    this.abrirModalAdicionar();
  }

  abrirModalAdicionar() {
    const dialogRef = this.dialog.open(ModalCondominioComponent, {
      width: '500px',
      height: '90%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.adicionaCondo(result);
      }
    });
  }

  adicionaCondo(condo: any) {
    this.condominiosService.createEstablishment(condo).subscribe({
      next: (response: any) => {
        this.alertService.presentAlert('Muito bem!', 'Condominio registrado com sucesso.');
        this._snackBar.open('Muito bem! Condominio registrado com sucesso.', '', {
          duration: 3000,
          panelClass:['sucess-snackbar']
        });
        this.getCondominios();
      },
      error: (error:any) => {
        console.log(error);


        // Verifica o código de erro HTTP e exibe a mensagem apropriada
        if (error.status === 400) {
          this.alertService.presentAlert('Atenção', error.error.message );
        } else {
          this.alertService.presentAlert('Erro de Comunicação', 'Houve um erro de comunicação, tente novamente.');
        }

        console.error('Erro no registrar', error);
      }
    })
  }

  excluirCondo= (condo: any) => {
    const dialogRef = this.dialog.open(ModalConfirmDialogComponent, {
      width: '300px',
      data: { titulo: 'Atenção', mensagem: 'Deseja excluir o condominio ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(condo);
        this.condominiosService.deleteEstablishment(condo.id).subscribe({
          next: () => {
            this.getCondominios();
          },
        });
      } else {
        console.log("Usuário cancelou.");
      }
    });
  }


}
