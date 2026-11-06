import { Component, Injectable, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
@Injectable({providedIn:'root'})
export class ValidationNotice {
  readonly message = signal('');
}
@Component({
  selector:'app-validation-notice', standalone:true, imports:[CommonModule],
  template:`<aside *ngIf="notice.message()" role="alert" style="position:fixed;left:1rem;right:1rem;top:calc(env(safe-area-inset-top, 0px) + 1rem);z-index:100000;background:#fff3f3;color:#8c1620;padding:1rem;border:1px solid #c53030;border-radius:8px;max-height:40vh;overflow:auto">
    <strong>Revise os dados</strong><p>{{ notice.message() }}</p>
    <button type="button" (click)="notice.message.set('')" style="padding:.5rem">Fechar aviso</button>
  </aside>`
})
export class ValidationNoticeComponent { readonly notice = inject(ValidationNotice); }
