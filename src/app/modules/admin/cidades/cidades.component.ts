import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CidadeService } from '../../../shared/services/cidades/cidades.service';
import { IonicModule, IonModal } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../shared/components/dialog/alert.service';

@Component({
  selector: 'app-cidades',
  standalone: true,
  imports: [TableComponent,IonicModule,FormsModule, CommonModule],
  templateUrl: './cidades.component.html',
  styleUrl: './cidades.component.scss'
})
export class CidadesComponent {

  columns = ['nome', 'createdAt'];
  data = [];
  @ViewChild('modalAdicionaCidade', { static: false, read: IonModal }) modalAdicionaCidade!: IonModal;
  @ViewChild('modalStatusCliente', { static: false }) modalStatusCliente!: IonModal;
  isModalOpen = false;
  nomeCidade = '';

  constructor(
    private cidadeService: CidadeService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getCidades();
  }

  getCidades() {
    this.cidadeService.getAllCidades().subscribe({
      next: (value: any) => {
        console.log(value);
        this.data = value;
      },
    });
  }

  handleButtonClick = () => {
    this.setOpen(true);
  };

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  adicionaCidade(){
    const cidade = {
      nome: this.nomeCidade
    }
    if(cidade.nome){
      this.cidadeService.createCidades(cidade).subscribe({
        next: (value: any) => {
          console.log(value);
          this.getCidades();
          this.setOpen(false);
        },
      });
    }else{
      this.alertService.presentAlert('Atenção ', 'Preencha um nome de cidade');
    }
  }

  editarCidade(usuario: any) {
    console.log('Editando cidade:', usuario);
    // Aqui você pode abrir um modal ou navegar para uma página de edição
  }

  excluirCidade(cidade: any) {
    console.log('Excluindo cidade:', cidade);
    this.data = this.data.filter(u => u !== cidade);
  }
}
