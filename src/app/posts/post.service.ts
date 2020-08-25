import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiURL + 'posts/';
// const BACKEND_URL = 'http://localhost:3000/api/posts/';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private totalPost: number;
  private postUpdated = new Subject<{ posts: Post[], total: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(page: number, size: number) {
    // return [...this.posts];
    const queryParams = `?page=${page}&pagesize=${size}`;
    this.http.get<{ message: string, posts: any, totalPosts: number }>(BACKEND_URL + queryParams)
      .pipe(map(postData => {
        console.log(postData);

        return {
          posts: postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator
            }

          }),
          totalPost: postData.totalPosts
        }
      }))
      .subscribe(postsResult => {
        console.log(postsResult);
        this.posts = postsResult.posts;
        this.postUpdated.next({ posts: [...this.posts], total: postsResult.totalPost });
      })
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    // return { ...this.posts.find(p => p.id === id) };
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData).subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post = { id, title, content, imagePath: null };
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image, creator: null }
    }
    this.http.put(BACKEND_URL + id, postData).subscribe(responseData => {
      // console.log(responseData);
      this.router.navigate(['/']);
    })
  }

  deletePost(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }


}
