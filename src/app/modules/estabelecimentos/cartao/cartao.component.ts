import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompaniesService } from '../../../shared/services/companies/companies.service';


@Component({
  selector: 'app-cartao',
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.scss'],
  standalone:true,
  imports: [FormsModule,CommonModule, ReactiveFormsModule],

})
export class CartaoComponent  implements OnInit {
  formCompany!: FormGroup;
  companyId:any;
  companyDetails:any;
  isFavorito: boolean = false;
  empresaId!: string;
  selectedCondominio!: any;

  constructor(
        private location: Location,
        private fb: FormBuilder,
        private companyService:CompaniesService,
        private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.createForm();
    this.activatedRoute.params.subscribe(params => {
      this.companyId = params['id'];  // 'id' deve ser o nome do parâmetro na URL
      console.log('ID da empresa:', this.companyId);

      // Agora, você pode usar esse ID para fazer uma chamada no serviço
      this.getCompanyDetails();

    });
    this.carregarFavorito();

  }

    getCompanyDetails() {
      this.companyService.getById(this.companyId).subscribe(
        (data) => {
          this.companyDetails = data;
          this.populateForm(this.companyDetails);
          console.log('Detalhes da empresa:', this.companyDetails);
        },
        (error) => {
          console.error('Erro ao buscar os detalhes da empresa:', error);
        }
      );
    }

    createForm() {
      this.formCompany = this.fb.group({
        id: ['', [Validators.required]],
        nome: ['', [Validators.required, Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email]],
        cnpj: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)]],
        telefone: [''],
        celular: [''],
        endereco: ['', [Validators.required, Validators.maxLength(200)]],
        complemento: [''],
        cidade: ['', [Validators.required, Validators.maxLength(100)]],
        estado: ['', [Validators.required, Validators.maxLength(2)]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
        site_url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.*$/)]],
        facebook_url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.*$/)]],
        instagram_url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.*$/)]],
        youtube_url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.*$/)]],
        banner: ['', [Validators.required, Validators.pattern(/^https?:\/\/.*$/)]],
        avatar: ['', [Validators.required, Validators.pattern(/^https?:\/\/.*$/)]],
        descricao: ['', [Validators.required, Validators.maxLength(500)]],
        slogan: ['', [Validators.required, Validators.maxLength(100)]],
        status: ['', [Validators.required]],
        asaasCustomerId: ['', [Validators.required]],
        isActive: [true, [Validators.required]],
        user_id: ['', [Validators.required]] // Aqui você pode definir o ID do usuário posteriormente
      });
    }

    populateForm(company: any) {
      if (this.formCompany) {
        this.formCompany.patchValue({
          id: company.id,
          nome: company.nome || '',
          email: company.email || '',
          cnpj: company.cnpj || '',
          telefone: company.telefone || '',
          celular: company.celular || '',
          complemento: company.complemento || '',
          endereco: company.endereco || '',
          cidade: company.cidade || '',
          estado: company.estado || '',
          latitude: company.latitude || '',
          longitude: company.longitude || '',
          site_url: company.site_url || '',
          facebook_url: company.facebook_url || '',
          instagram_url: company.instagram_url || '',
          youtube_url: company.youtube_url || '',
          banner: company.banner || '',
          avatar: company.avatar || '',
          descricao: company.descricao || '',
          slogan: company.slogan || '',
          status: company.status || '',
          asaasCustomerId: company.asaasCustomerId || '',
          isActive: company.isActive ?? true,
        });

        this.selectedCondominio = company.condominios[0].nome;

      }
    }

  openMap() {
    // Pegando os dados do condomínio vinculado
    const condominioVinculado = this.companyDetails

    let mapUrl: string;

    if (condominioVinculado) {
      const { latitude, longitude, endereco, bairro, nome, cidade } = condominioVinculado;
      console.log(condominioVinculado);

      if (latitude && longitude) {
        mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      } else if (endereco && bairro) {
        mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(endereco)},${encodeURIComponent(bairro)}`;
      } else {
        mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(nome)},${encodeURIComponent(cidade)}`;
      }
    } else {
      // Caso não tenha condomínio vinculado, usa os dados da empresa
      const latitude = this.formCompany.controls['latitude'].value;
      const longitude = this.formCompany.controls['longitude'].value;
      const endereco = this.formCompany.controls['endereco'].value;
      const bairro = this.formCompany.controls['bairro']?.value;
      const cidade = this.formCompany.controls['cidade'].value;

      if (latitude && longitude) {
        mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      } else if (endereco && bairro) {
        mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(endereco)},${encodeURIComponent(bairro)}`;
      } else {
        mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(endereco)},${encodeURIComponent(cidade)}`;
      }
    }

    // Abre o link no Google Maps em uma nova aba
    window.open(mapUrl, '_blank');
  }
    back(){
      this.location.back();
    }

    carregarFavorito(): void {
      // Buscar a lista de favoritos no localStorage
      const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

      console.log('Favoritos:', favoritos);
      console.log('Company ID:', this.companyId, 'Tipo:', typeof this.companyId);

      // Verificar se algum item na lista tem o mesmo ID
      this.isFavorito = favoritos.some((fav:any) => fav.id === Number(this.companyId));

      console.log('É favorito?', this.isFavorito);
    }


// Alterna entre favoritar e desfavoritar
toggleFavorito(): void {
  this.isFavorito = !this.isFavorito;
  this.salvarFavorito();
}

// Salva o estado de favorito no localStorage
salvarFavorito(): void {
  // Obtém os favoritos do localStorage e garante que seja um array
  let favoritos: any[] = JSON.parse(localStorage.getItem('favoritos') || '[]');

  // Se 'favoritos' não for um array, reinicializa como array vazio
  if (!Array.isArray(favoritos)) {
    console.warn("⚠️ Corrigindo estrutura inválida no localStorage. Redefinindo favoritos.");
    favoritos = [];
  }

  // Converter companyId para número, se necessário
  const empresaId = Number(this.companyId);

  // Verifica se a empresa já está nos favoritos
  const index = favoritos.findIndex(fav => fav.id === empresaId);

  if (this.isFavorito) {
    // Se não estiver nos favoritos, adiciona
    if (index === -1) {
      favoritos.push({ id: empresaId, ...this.companyDetails });
    }
  } else {
    // Se já estiver nos favoritos e o usuário remover, exclui
    if (index !== -1) {
      favoritos.splice(index, 1);
    }
  }

  // Salva de volta no localStorage
  localStorage.setItem('favoritos', JSON.stringify(favoritos));

  console.log('✅ Favoritos atualizados:', favoritos);
}


    openFacebook() {
      const facebookUrl = this.formCompany.controls['facebook_url'].value;
      if (facebookUrl) {
        window.open(facebookUrl, '_blank');
      }
    }

    openInstagram() {
      let instagramUrl = this.formCompany.controls['instagram_url'].value;

      if (instagramUrl) {
        // Remove @ se existir
        instagramUrl = instagramUrl.replace(/^@/, '');

        // Monta o link completo
        const profileUrl = `https://instagram.com/${instagramUrl}`;

        window.open(profileUrl, '_blank');
      }
    }


    openWhatsApp() {
      const whatsappNumber = this.formCompany.controls['celular'].value;
      if (whatsappNumber) {
        const message = encodeURIComponent("Olá, vim do app CondoConnect e gostaria de mais informações.");
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
        window.open(whatsappLink, '_blank');
      }
    }

    async compartilharEmpresa() {
      const id = this.formCompany.controls['id'].value;
      const nome = this.formCompany.controls['nome'].value;
      const urlBase = 'https://condoconnectbr.com/empresa';

      const linkCompartilhamento = `${urlBase}?nome=${encodeURIComponent(id)}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: `Conheça ${nome}!`,
            text: `Confira a empresa ${nome}! Veja mais detalhes aqui:`,
            url: linkCompartilhamento,
          });
          console.log('Compartilhado com sucesso!');
        } catch (error) {
          console.error('Erro ao compartilhar:', error);
        }
      } else {
        // Fallback para copiar link
        try {
          await navigator.clipboard.writeText(linkCompartilhamento);
          alert('Link copiado para a área de transferência!');
        } catch (error) {
          console.error('Erro ao copiar link:', error);
          alert('Seu navegador não suporta compartilhamento.');
        }
      }
    }

}
