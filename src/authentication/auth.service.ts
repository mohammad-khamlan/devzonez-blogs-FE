import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000';
  private tokenKey = 'token';

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signin`, { email, password });
  }

  signUp(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, { name, email, password });
  }

  isAuthenticated(): boolean {
    const token = this.cookieService.get(this.tokenKey);
    return !!token;
  }

  checkToken(): Promise<boolean> {
    return new Promise((resolve) => {
      const token = this.cookieService.get(this.tokenKey);
      if (token) {
        resolve(true);
      } else {
        this.router.navigate(['/auth/sign-in']);
        resolve(false);
      }
    });
  }

}
