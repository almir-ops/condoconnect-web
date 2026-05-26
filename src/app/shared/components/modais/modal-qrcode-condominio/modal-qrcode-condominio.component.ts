import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import QRCode from 'qrcode';

@Component({
  selector: 'app-modal-qrcode-condominio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-qrcode-condominio.component.html',
})
export class ModalQrcodeCondominioComponent implements OnInit {
  condo: any = null;
  qrCodeUrl: string = '';
  destinoUrl: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalQrcodeCondominioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.condo = data?.condo || null;
  }

  ngOnInit(): void {
    if (!this.condo?.id) {
      return;
    }

    this.destinoUrl = `${window.location.origin}/condominio/${this.condo.id}`;
    this.gerarQrCode();
  }

  gerarQrCode(): void {
    QRCode.toDataURL(this.destinoUrl, {
      width: 500,
      margin: 2,
      errorCorrectionLevel: 'H',
    })
      .then((url: string) => {
        this.qrCodeUrl = url;
      })
      .catch((error: any) => {
        console.error('Erro ao gerar QR Code:', error);
      });
  }

  baixarQrCode(): void {
    if (!this.qrCodeUrl) return;

    const nomeCondominio = this.normalizarNomeArquivo(
      this.condo?.nome || 'condominio',
    );

    const link = document.createElement('a');
    link.href = this.qrCodeUrl;
    link.download = `qrcode-${nomeCondominio}.png`;
    link.click();
  }

  async compartilhar(): Promise<void> {
    const texto = this.montarTextoCompartilhamento();

    try {
      if (navigator.share) {
        const arquivo = await this.criarArquivoQrCode();

        if (
          arquivo &&
          navigator.canShare &&
          navigator.canShare({ files: [arquivo] })
        ) {
          await navigator.share({
            title: `QR Code - ${this.condo?.nome || 'Condomínio'}`,
            text: texto,
            url: this.destinoUrl,
            files: [arquivo],
          });

          return;
        }

        await navigator.share({
          title: `QR Code - ${this.condo?.nome || 'Condomínio'}`,
          text: texto,
          url: this.destinoUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(`${texto}\n\n${this.destinoUrl}`);
      alert('Link copiado para a área de transferência.');
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  }

  async criarArquivoQrCode(): Promise<File | null> {
    if (!this.qrCodeUrl) return null;

    const response = await fetch(this.qrCodeUrl);
    const blob = await response.blob();

    const nomeCondominio = this.normalizarNomeArquivo(
      this.condo?.nome || 'condominio',
    );

    return new File([blob], `qrcode-${nomeCondominio}.png`, {
      type: 'image/png',
    });
  }

  montarTextoCompartilhamento(): string {
    const endereco = this.montarEndereco();

    const partes = [
      `Condomínio: ${this.condo?.nome || '-'}`,
      endereco ? `Endereço: ${endereco}` : '',
      this.condo?.cidade || this.condo?.estado
        ? `Cidade/Estado: ${this.condo?.cidade || ''}${this.condo?.estado ? ' - ' + this.condo.estado : ''}`
        : '',
      this.condo?.telefone ? `Telefone: ${this.condo.telefone}` : '',
      `Acesse: ${this.destinoUrl}`,
    ];

    return partes.filter(Boolean).join('\n');
  }

  montarEndereco(): string {
    const partes = [
      this.condo?.endereco || '',
      this.condo?.numero ? `, ${this.condo.numero}` : '',
      this.condo?.bairro ? ` - ${this.condo.bairro}` : '',
    ];

    return partes.join('').trim();
  }

  copiarLink(): void {
    if (!this.destinoUrl) return;

    navigator.clipboard.writeText(this.destinoUrl);
    alert('Link copiado.');
  }

  normalizarNomeArquivo(nome: string): string {
    return String(nome || 'condominio')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
