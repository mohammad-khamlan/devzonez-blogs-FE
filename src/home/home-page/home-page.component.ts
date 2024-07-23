import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { HomeService } from '../home.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  posts: any[] = [];
  isModalVisible: boolean = false;
  postForm!: FormGroup;
  subscription$: Subscription[] = new Array<Subscription>;

  constructor(private http: HttpClient, private homeService: HomeService, private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.subscription$.push(
      this.homeService.getPosts().subscribe((data) => {
        this.posts = data;
        console.log('Posts loaded', data);
      }, (error) => {
        console.error('Error loading posts', error);
      })
    );
  }

  toggleCommentBox(post: any): void {
    post.showCommentBox = !post.showCommentBox;
    if (!post.newComment) {
      post.newComment = '';
    }
  }

  addComment(post: any, postIndex: number): void {
    this.subscription$.push(
      this.homeService.addComment(post).subscribe((comment: any) => {
        this.posts[postIndex] = comment;
        post.comments.push(comment);
        post.newComment = '';
        post.showCommentBox = false;
      }, (error) => {
        console.error('Error adding comment', error);
      })
    );
  }

  toggleReplyBox(comment: any): void {
    comment.showReplyBox = !comment.showReplyBox;
    if (!comment.newReply) {
      comment.newReply = '';
    }
  }

  addReply(post: any, comment: any, postIndex: number): void {
    this.subscription$.push(
      this.homeService.addReply(post, comment).subscribe((reply: any) => {
        this.posts[postIndex] = reply;
        comment.replies.push(reply);
        comment.newReply = '';
        comment.showReplyBox = false;
      }, (error) => {
        console.error('Error adding reply', error);
      })
    );
  }

  openCreatePostModal() {
    this.isModalVisible = true;
  }

  createPost() {
    if (this.postForm.valid) {
      const newPost = this.postForm.value;

      this.subscription$.push(
        this.homeService.createPost(newPost).subscribe((post) => {
          this.posts.push(post);
          this.postForm.reset();
          this.isModalVisible = false;
        }, (error) => {
          console.error('Error creating post', error);
        })
      );
    }
  }

  handleOk(): void {
  }

  handleCancel(): void {
    this.postForm.reset();
    this.isModalVisible = false;
  }

  ngOnDestroy(): void {
    this.subscription$?.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }
}
