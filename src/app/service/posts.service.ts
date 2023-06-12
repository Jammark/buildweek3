import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../model/post';
import { Comment } from '../model/comment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private postSubj = new BehaviorSubject<null|Post>(null);
  post$ = this.postSubj.asObservable();

  constructor(private http: HttpClient) { }

  getPosts():Observable<Post[]>{
    return this.http.get<Post[]>(`${environment.baseURL}post`);
  }

  getComments():Observable<Comment[]>{
    return this.http.get<Comment[]>(`${environment.baseURL}post-comment`);
  }

  register(item:Post):void{
    this.postSubj.next(item);
  }

  deregister():void{
    this.postSubj.next(null);
  }

  send(item: Post):Observable<boolean>{
    return this.http.post<boolean>(`${environment.baseURL}post`, item);
  }

  update(item:Post):Observable<boolean>{
    return this.http.put<boolean>(`${environment.baseURL}post/${item.id}`, item);
  }
}
