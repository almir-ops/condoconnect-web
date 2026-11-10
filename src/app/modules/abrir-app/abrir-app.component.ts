import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Página aberta pelo botão dos e-mails do painel. Tenta abrir o app na tela pedida
// (condoconnect://app/<tela>); quem não tem o app instalado vê os links das lojas.
@Component({
  selector: 'app-abrir-app', standalone: true, imports: [CommonModule],
  template: `
    <main class="wrap">
      <div class="box">
        <img src="/assets/images/logo_texto.png" alt="CondoConnect" class="logo" />
        <h1>{{ tentando ? 'Abrindo o CondoConnect…' : 'Abrir o CondoConnect' }}</h1>
        <p>Se o app não abrir sozinho, toque no botão abaixo. Ainda não tem o aplicativo? Baixe na sua loja.</p>
        <a class="btn primary" [href]="deepLink">Abrir no app</a>
        <div class="stores">
          <a class="btn" href="https://apps.apple.com/br/app/condoconnect/id6748700594">App Store (iPhone)</a>
          <a class="btn" href="https://play.google.com/store/apps/details?id=br.com.condoconnect">Google Play (Android)</a>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .wrap { min-height: 100dvh; display: grid; place-items: center; padding: 1.5rem; background: linear-gradient(to bottom, #055e4c, #004745); }
    .box { width: 100%; max-width: 26rem; padding: 2rem 1.5rem; border-radius: 1rem; background: #fff; text-align: center; color: #243b36; box-shadow: 0 20px 50px #0004; }
    .logo { height: 3rem; margin: 0 auto 1rem; object-fit: contain; }
    h1 { margin: 0 0 .5rem; font-size: 1.35rem; color: #044d3f; }
    p { margin: 0 0 1.25rem; color: #60716c; font-size: .95rem; line-height: 1.5; }
    .btn { display: block; padding: .8rem 1rem; border-radius: .6rem; border: 1px solid #c9d6d1; color: #044d3f; font-weight: 600; text-decoration: none; margin-top: .6rem; }
    .btn.primary { background: #055e4c; border-color: #055e4c; color: #fff; margin-top: 0; }
    .stores { margin-top: 1rem; }
  `],
})
export class AbrirAppComponent implements OnInit {
  deepLink = 'condoconnect://app/inicio';
  tentando = false;
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    const to = String(this.route.snapshot.queryParamMap.get('to') || '/inicio');
    // só caminhos simples do app (letras, números, / - _); qualquer outra coisa cai no início
    const safe = /^\/[a-zA-Z0-9/_-]{0,120}$/.test(to) ? to : '/inicio';
    this.deepLink = `condoconnect://app${safe}`;
    this.tentando = true;
    setTimeout(() => { window.location.href = this.deepLink; }, 250);
    setTimeout(() => { this.tentando = false; }, 2500);
  }
}
