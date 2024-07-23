import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnDestroy {
  signInForm: FormGroup;
  signInSubscription$: Subscription = new Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitForm(): void {
    if (this.signInForm.valid) {
      this.signInSubscription$ = this.authService.signIn(this.signInForm.value.email, this.signInForm.value.password).subscribe(
        response => {
          console.log('Sign-in successful', response);
          this.cookieService.set('token', response.token);
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Sign-in error', error);
        }
      );
    }
  }

  ngOnDestroy() {
    this.signInSubscription$.unsubscribe();
  }
}
