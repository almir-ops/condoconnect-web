import { CommonModule } from '@angular/common';
import { Component, ContentChild, ElementRef, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-companys',
  templateUrl: './lista-companys.component.html',
  styleUrls: ['./lista-companys.component.scss'],
  standalone:true,
  imports: [FormsModule,CommonModule],
})
export class ListaCompanysComponent  implements OnInit {

  pesquisar:string = '';
  cidadeSelecionada:string = '';
  selectedCondominio:string = '';
  selectedCondominioInfo:string = '';

  empresas = [
    { id: 1, nome: 'Supermercado Brasil', localizacao: 'São Paulo, SP' },
    { id: 2, nome: 'Padaria Pão Quente', localizacao: 'Rio de Janeiro, RJ' },
    { id: 3, nome: 'Restaurante Sabor da Terra', localizacao: 'Belo Horizonte, MG' },
    { id: 4, nome: 'Loja de Roupas Elegância', localizacao: 'Curitiba, PR' },
    { id: 5, nome: 'Livraria Cultura Viva', localizacao: 'Porto Alegre, RS' },
    { id: 6, nome: 'Academia Boa Forma', localizacao: 'Salvador, BA' },
    { id: 7, nome: 'Farmácia Saúde Já', localizacao: 'Florianópolis, SC' },
    { id: 8, nome: 'Pet Shop Amigo Animal', localizacao: 'Recife, PE' },
    { id: 9, nome: 'Sorveteria Frio Doce', localizacao: 'Manaus, AM' },
    { id: 10, nome: 'Loja de Eletrônicos TechZone', localizacao: 'Brasília, DF' }
  ];
  categorias = [
    {
      id: 1,
      nome: 'Supermercados',
      tipo: 'Alimentos', // Tipo da subcategoria
      subcategorias: [
        {
          id: 1.1,
          nome: 'Supermercado de Bairro',
          tipo: 'Alimentos', // Tipo da subcategoria
          empresas: [
            { id: 1, nome: 'Supermercado Brasil', localizacao: 'São Paulo, SP' }
          ]
        },
        {
          id: 1.2,
          nome: 'Supermercado Online',
          tipo: 'Alimentos', // Tipo da subcategoria
          empresas: []
        }
      ]
    },
    {
      id: 2,
      nome: 'Padarias',
      tipo: 'Alimentos', // Tipo da subcategoria
      subcategorias: [
        {
          id: 2.1,
          nome: 'Padaria Tradicional',
          tipo: 'Alimentos', // Tipo da subcategoria
          empresas: [
            { id: 2, nome: 'Padaria Pão Quente', localizacao: 'Rio de Janeiro, RJ' }
          ]
        }
      ]
    },
    {
      id: 3,
      nome: 'Restaurantes',
      tipo: 'Alimentos', // Tipo da subcategoria
      subcategorias: [
        {
          id: 3.1,
          nome: 'Comida Rápida',
          tipo: 'Alimentos', // Tipo da subcategoria
          empresas: [
            { id: 3, nome: 'Restaurante Sabor da Terra', localizacao: 'Belo Horizonte, MG' }
          ]
        },
        {
          id: 3.2,
          nome: 'Comida Vegetariana',
          tipo: 'Alimentos', // Tipo da subcategoria
          empresas: []
        }
      ]
    },
    {
      id: 4,
      nome: 'Lojas de Roupas',
      tipo: 'Moda', // Tipo da subcategoria
      subcategorias: [
        {
          id: 4.1,
          nome: 'Lojas de Roupas Femininas',
          tipo: 'Moda', // Tipo da subcategoria
          empresas: [
            { id: 4, nome: 'Loja de Roupas Elegância', localizacao: 'Curitiba, PR' }
          ]
        },
        {
          id: 4.2,
          nome: 'Lojas de Roupas Masculinas',
          tipo: 'Moda', // Tipo da subcategoria
          empresas: []
        }
      ]
    },
    {
      id: 5,
      nome: 'Livrarias',
      tipo: 'Cultura', // Tipo da subcategoria
      subcategorias: [
        {
          id: 5.1,
          nome: 'Livrarias de Grande Porte',
          tipo: 'Cultura', // Tipo da subcategoria
          empresas: [
            { id: 5, nome: 'Livraria Cultura Viva', localizacao: 'Porto Alegre, RS' }
          ]
        }
      ]
    },
    {
      id: 6,
      nome: 'Academias',
      tipo: 'Saúde e Bem-estar', // Tipo da subcategoria
      subcategorias: [
        {
          id: 6.1,
          nome: 'Academias de Ginástica',
          tipo: 'Saúde e Bem-estar', // Tipo da subcategoria
          empresas: [
            { id: 6, nome: 'Academia Boa Forma', localizacao: 'Salvador, BA' }
          ]
        }
      ]
    },
    {
      id: 7,
      nome: 'Farmácias',
      tipo: 'Saúde', // Tipo da subcategoria
      subcategorias: [
        {
          id: 7.1,
          nome: 'Farmácias de Bairro',
          tipo: 'Saúde', // Tipo da subcategoria
          empresas: [
            { id: 7, nome: 'Farmácia Saúde Já', localizacao: 'Florianópolis, SC' }
          ]
        }
      ]
    },
    {
      id: 8,
      nome: 'Pet Shops',
      tipo: 'Animais', // Tipo da subcategoria
      subcategorias: [
        {
          id: 8.1,
          nome: 'Pet Shops de Bairro',
          tipo: 'Animais', // Tipo da subcategoria
          empresas: [
            { id: 8, nome: 'Pet Shop Amigo Animal', localizacao: 'Recife, PE' }
          ]
        }
      ]
    },
    {
      id: 9,
      nome: 'Sorveterias',
      tipo: 'Alimentos', // Tipo da subcategoria
      subcategorias: [
        {
          id: 9.1,
          nome: 'Sorveterias Artesanais',
          tipo: 'Alimentos', // Tipo da subcategoria
          empresas: [
            { id: 9, nome: 'Sorveteria Frio Doce', localizacao: 'Manaus, AM' }
          ]
        }
      ]
    },
    {
      id: 10,
      nome: 'Lojas de Eletrônicos',
      tipo: 'Tecnologia', // Tipo da subcategoria
      subcategorias: [
        {
          id: 10.1,
          nome: 'Lojas de Eletrônicos Online',
          tipo: 'Tecnologia', // Tipo da subcategoria
          empresas: [
            { id: 10, nome: 'Loja de Eletrônicos TechZone', localizacao: 'Brasília, DF' }
          ]
        }
      ]
    }
  ];


  constructor(private router:Router) { }

  ngOnInit() {
    this.cidadeSelecionada = localStorage.getItem('selectedCity') || '';
    const storedCondominio = localStorage.getItem('establishmentSelected') || '';
    const [condominioName, condominioInfo] = storedCondominio.split(' - ');
    this.selectedCondominio = condominioName || '';
    this.selectedCondominioInfo = condominioInfo || '';   }

  navegate(rota:any){
    this.router.navigate([rota]);
  }

  rollback(){
    this.navegate('init')
    localStorage.removeItem('selectedCity')
    localStorage.removeItem('establishmentSelected')
  }

  name = 'Angular';
  slides = [
    {
      yek: 'https://placehold.jp/150x150.png',
      description: 'We will help you 1',
    },
    {
      yek: 'https://placehold.jp/150x150.png',
      description: 'We will help you 2',
    },
    {
      yek: 'https://placehold.jp/150x150.png',
      description: 'We will help you 3',
    },
    {
      yek: 'https://placehold.jp/150x150.png',
      description: 'We will help you 4',
    },
    {
      yek: 'https://placehold.jp/150x150.png',
      description: 'We will help you 5',
    },
    {
      yek: 'https://placehold.jp/150x150.png',
      description: 'We will help you 6',
    },
    {
      yek: 'https://placehold.jp/150x150.png',
      description: 'We will help you 7',
    },
    {
      yek: 'https://placehold.jp/150x150.png',
      description: 'We will help you 8',
    },
    // Add more slides as needed
  ];
}


