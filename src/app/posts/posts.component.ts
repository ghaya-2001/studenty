
import { Component, OnInit } from '@angular/core';
import { PostService, CreatePostResponse , DeletePostResponse} from '../services/post.service';
import { Post, Comment } from '../models/post.model';




@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  userComment: string = '';
  displayedCommentsCount: number = 2;
  uploadedImageUrl: string | ArrayBuffer | null = null;
  uploadedVideoUrl: string | ArrayBuffer | null = null;
  content: string = '';
  posts: Post[] = [];
  userLogo: string = 'assets/logo.png';
  clubName: string = 'Example Club';
  postTime: string = 'Just now';

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.fetchPosts();
  }
  fetchPosts(): void {
    this.postService.getPosts().subscribe((response: any) => {
      this.posts = response.posts.reverse();
      console.log(response);
    });
  }
  

  openCreateModal(): void {
    this.selectedPost = null;
    this.content = "";
    this.uploadedImageUrl = null;
    this.uploadedVideoUrl = null;
    const modelDiv = document.getElementById("myModal");
    if (modelDiv != null) {
      modelDiv.style.display = "block";
    }
  }

  closeModel() {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (file.type.startsWith('image/')) {
          this.uploadedImageUrl = e.target?.result || null;
          this.uploadedVideoUrl = null;
        } else if (file.type.startsWith('video/')) {
          this.uploadedVideoUrl = e.target?.result || null;
          this.uploadedImageUrl = null;
        }
      };
      fileReader.readAsDataURL(file);
    }
  }

  openFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  sharePost(post: Post): void {
    // Implement sharing functionality here, if needed.
    post.sharesCount++;
  }
  publishPost(): void {
    if (this.selectedPost) {
      this.updatePost(this.selectedPost);
    } else {
      if (this.content.trim() !== "" || this.uploadedImageUrl || this.uploadedVideoUrl) {
        const newPost: Post = {
     
          userLogo: this.userLogo,
          clubName: this.clubName,
          postTime: this.postTime,
          imageUrl: this.uploadedImageUrl,
          videoUrl: this.uploadedVideoUrl,
          content: this.content,
          sharesCount: 0,
          comments: [],
          likesCount: 0,
          liked: false,
          showOptions: false,
          createdAt: new Date().toISOString(),
        };
  
        this.postService.createPost(newPost).subscribe(
          (response: CreatePostResponse) => {
            console.log('Post created:', response);
            this.posts.unshift(response.post);
          },
          (error) => {
            console.error('Failed to create post:', error);
          }
        );
  
        this.content = "";
        this.uploadedImageUrl = null;
        this.uploadedVideoUrl = null;
        this.closeModel();
      }
    }
  }
  

  submitComment(post: Post): void {
    if (this.userComment.trim() !== "") {
      const newComment: Comment = {
        text: this.userComment,
        showOptions: false,
        editing: false,
      };
      post.comments.push(newComment);
      this.userComment = '';
    }
  }

  toggleLike(post: Post): void {
    if (post.liked) {
      post.likesCount--;
    } else {
      post.likesCount++;
    }
    post.liked = !post.liked;
  }

  toggleOptions(comment: Comment): void {
    comment.showOptions = !comment.showOptions;
  }

  editComment(comment: Comment): void {
    comment.showOptions = false;
    comment.editing = true;
  }

  deleteComment(post: Post, comment: Comment): void {
    post.comments = post.comments.filter((c) => c !== comment);
  }

  showMoreComments(): void {
    this.displayedCommentsCount += 2;
  }

  hideMoreComments(): void {
    this.displayedCommentsCount = 2;
  }

  saveEditedComment(comment: Comment, event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      comment.editing = false;
      const newComment = (event.target as HTMLTextAreaElement).value;
      if (newComment.trim() !== '') {
        comment.text = newComment;
      }
    }
  }

  togglePostOptions(post: Post): void {
    post.showOptions = !post.showOptions;
  }
//-----------------------deletePost----------------//
deletePost(post: Post): void {
  if (post._id) {
    this.postService.deletePost(post._id).subscribe(
      (response: DeletePostResponse) => {
        console.log('Post deleted:', response);
        this.posts = this.posts.filter((p) => p !== post);
      },
      (error) => {
        console.error('Failed to delete post:', error);
      }
    );
  } else {
    console.error('Post _id is undefined');
  }
}
  selectedPost: Post | null = null;
  openUpdateModal(post: Post): void {
    this.selectedPost = post;
    this.content = post.content;
    this.uploadedImageUrl = post.imageUrl;
    this.uploadedVideoUrl = post.videoUrl;
    const modelDiv = document.getElementById("myModal");
    if (modelDiv != null) {
      modelDiv.style.display = "block";
    }
  }
  updatePost(post: Post): void {
    if (this.content.trim() !== "" || this.uploadedImageUrl || this.uploadedVideoUrl) {
      post.content = this.content;
      post.imageUrl = this.uploadedImageUrl;
      post.videoUrl = this.uploadedVideoUrl;
      post.likesCount = post.likesCount; // Add this line
      post.sharesCount = post.sharesCount; // Add this line
      post.comments = post.comments; // Add this line
  
      this.postService.updatePost(post).subscribe(
        (response) => {
          console.log('Post updated:', response);
          this.fetchPosts(); // Refresh the list of posts after updating
        },
        (error) => {
          console.error('Failed to update post:', error);
        }
      );
  
      this.content = "";
      this.uploadedImageUrl = null;
      this.uploadedVideoUrl = null;
      this.closeModel();
    }
  }
}
