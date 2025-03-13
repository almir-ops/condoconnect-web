import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CidadeService } from '../../../shared/services/cidades/cidades.service';
import { IonicModule, IonModal } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cidades',
  standalone: true,
  imports: [TableComponent,IonicModule,FormsModule],
  templateUrl: './cidades.component.html',
  styleUrl: './cidades.component.scss'
})
export class CidadesComponent {

  columns = ['nome', 'telefone', 'endereco', 'cidade', 'estado', 'esta_ativo' ];
  data = [];
  @ViewChild('modalAdicionaCidade', { static: false, read: IonModal }) modalAdicionaCidade!: IonModal;
  @ViewChild('modalStatusCliente', { static: false }) modalStatusCliente!: IonModal;
  isModalOpen = false;


  constructor(
    private cidadeService: CidadeService,
  ) {}

  ngOnInit(): void {
    this.getCondominios();
    this.handleButtonClick();
  }

  ngAfterViewInit() {
    console.log('Modal inicializado:', this.modalAdicionaCidade);
  }
  getCondominios() {
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
}
