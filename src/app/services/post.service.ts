import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model'; // Update the import path
import { HttpHeaders } from '@angular/common/http';

export interface DeletePostResponse {
  message: string;
}
export interface CreatePostResponse {
  message: string;
  post: Post;
}
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly API_URL = 'http://localhost:5000/posts';

  constructor(private http: HttpClient) {}

  //-----------------createPost------------------//

  createPost(post: Post): Observable<CreatePostResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const postWithTimestamp = { ...post, createdAt: new Date().toISOString() };
    return this.http.post<CreatePostResponse>(this.API_URL, postWithTimestamp, { headers });
  }
  //---------------getPost---------------------------//
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.API_URL);
  }
  //-------------deletePost------------------//
  deletePost(postId: string): Observable<DeletePostResponse> {
    return this.http.delete<DeletePostResponse>(`${this.API_URL}/${postId}`);
  }
  //-------------------updqtePost--------------//
  updatePost(post: Post): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.API_URL}/${post._id}`, post, { headers });
  }
}
