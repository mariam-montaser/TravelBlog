import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  totalPosts: number = 10;
  postsPerPage: number = 2;
  currentPage: number = 1;
  pageSizeOptions: number[] = [1, 2, 5, 10];
  userIsAuth = false;
  userId: string;
  private postSub: Subscription;
  private authSubs: Subscription;

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.currentPage, this.postsPerPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postService.getPostUpdateListener().subscribe((postsData: { posts: Post[], total: number }) => {
      this.isLoading = false;
      this.posts = postsData.posts;
      this.totalPosts = postsData.total;
    })
    this.userIsAuth = this.authService.getIsAuth();
    this.authSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      // console.log(isAuth);
      this.userIsAuth = isAuth;
      this.userId = this.authService.getUserId();
    })
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.currentPage, this.postsPerPage);
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.currentPage, this.postsPerPage);
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authSubs.unsubscribe();
  }

}
