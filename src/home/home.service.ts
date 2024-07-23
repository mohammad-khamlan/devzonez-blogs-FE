import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiUrl = 'http://localhost:3000';
  private token = '';

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.token = this.cookieService.get('token');
  }

  getPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    })
  }

  addComment(post: any): Observable<any> {
    const newComment = { text: post.newComment };

    return this.http.post(`${this.apiUrl}/posts/${post._id}/comment`, newComment, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  addReply(post: any, comment: any): Observable<any> {

    const newReply = { text: comment.newReply };

    return this.http.post(`${this.apiUrl}/posts/${post._id}/comment/${comment._id}/reply`, newReply, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }


  createPost(newPost: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, newPost, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

}
