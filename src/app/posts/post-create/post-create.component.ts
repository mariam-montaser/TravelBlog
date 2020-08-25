import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostService } from '../post.service';
import { Post } from '../post.model';
import { mimeType } from "../mime-type.validator";
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  private mode = 'create';
  private postId: string;
  private authSub: Subscription;
  isLoading = false;
  post: Post;
  form: FormGroup;
  imgPreview: string;

  constructor(private postService: PostService, private route: ActivatedRoute, private authservice: AuthService) { }

  ngOnInit(): void {
    this.authSub = this.authservice.getAuthStatusListener().subscribe(isAuth => {
      this.isLoading = false;
    })
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    })
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.mode = 'edit'
        this.postId = params.get('id');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          })
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onFilePicked(event: Event) {
    console.log(event);

    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);

    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string;
      console.log(this.imgPreview);

    }
    reader.readAsDataURL(file);

  }

  onSavePost() {
    console.log(this.form.value);

    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
