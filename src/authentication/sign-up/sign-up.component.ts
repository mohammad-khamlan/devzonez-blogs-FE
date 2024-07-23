import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnDestroy {
  signUpForm: FormGroup;
  signUpSubscription$: Subscription = new Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitForm(): void {
    if (this.signUpForm.valid) {
      this.signUpSubscription$ = this.authService.signUp(this.signUpForm.value.name, this.signUpForm.value.email, this.signUpForm.value.password).subscribe((response) => {
        console.log('Sign-up successful', response);
        this.router.navigate(['/auth/sign-in']);
      }, (error) => {
        console.error('Sign-up error', error);
      });
    }
  }

  ngOnDestroy() {
    this.signUpSubscription$.unsubscribe();
  }
}
