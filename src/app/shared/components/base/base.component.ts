import { HttpClient } from '@angular/common/http';
import { Directive, inject } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AlertService } from '../dialog/alert.service';

type ControllType = AbstractControl<any, any> | null;

@Directive()
export abstract class BaseComponent {
  public form!: FormGroup;
  public fb: FormBuilder = inject(FormBuilder);
  public router: Router = inject(Router);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public loading: boolean = false;
  public http: HttpClient = inject(HttpClient);
  public _snackBar: MatSnackBar = inject(MatSnackBar);
  public authService: AuthService = inject(AuthService);
  public alertService: AlertService= inject(AlertService);

  public isErrorRequired(controll_name: string) {
    return this.getControll(controll_name)?.errors?.['required'];
  }

  get formControlls(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  notify(
    msg: string,
    type: string = 'sucess-snackbar',
    duration: number = 3000
  ) {
    this._snackBar.open(msg, '', {
      duration: duration,
      panelClass: [type],
    });
  }

  public redirectTo(route: string = '', back_route: boolean = false): void {
    if (back_route) {
      window.history.back();
      return;
    }

    this.router.navigate([route]);
  }

  public validateFirstInvalidField() {
    const form = this.form;
    console.log(form);
    for (const field of Object.keys(form.controls)) {
      const control = form.get(field);

      if (control && control.invalid) {
        control.markAsTouched();
        control.updateValueAndValidity();
        break;
      }
    }
  }

  private getControll(control: string): ControllType {
    return this.form.get(control);
  }
}
