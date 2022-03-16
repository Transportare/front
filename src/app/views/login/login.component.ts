import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '@services/login/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;
  error: boolean;

  private _subscription = new Subscription();

  constructor(private fb: FormBuilder, private route: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.error = false;
    this.initForm();
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  initForm() {
    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      error: [false],
    });
  }

  get ussernameValid() {
    return this.formLogin.get('username').invalid && this.formLogin.get('username').touched;
  }

  get passwordValid() {
    return this.formLogin.get('password').invalid && this.formLogin.get('password').touched;
  }

  get errorControl() {
    return this.formLogin.get('error');
  }

  ingresar() {
    if (this.formLogin.invalid) {
      return;
    }

    const data = {
      usuario: this.formLogin.value.username,
      password: this.formLogin.value.password,
    };

    this._subscription = this.loginService.logIng(data).subscribe(
      (response) => {
        this.loginService.saveDataUser(response);
        this.errorControl.setValue(false);
        this.route.navigate(['/dashboard']);
      },
      (error) => {
        this.errorControl.setValue(true);
      }
    );
  }
}
