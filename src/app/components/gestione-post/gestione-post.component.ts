import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/model/post';
import { User } from 'src/app/model/user';
import { PostsService } from 'src/app/service/posts.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-gestione-post',
  templateUrl: './gestione-post.component.html',
  styleUrls: ['./gestione-post.component.scss']
})
export class GestionePostComponent implements OnInit, OnDestroy{

  post?:Post | null;
  users: User[] = [];

  constructor(private srv: PostsService, private usrv: UserService,
    private router: Router){}

  ngOnInit(): void {
    this.srv.post$.subscribe(item => {
      if(item){
        this.post = item;
      }else{
        this.post = {
          title: '',
          body: ''
        };
      }
    });
    this.usrv.getUsers().subscribe(items => {
      this.users = items;
    });
  }

  submit():void{
    console.table(this.post);
    if(this.post){
      if(this.post?.id){
        this.srv.update(this.post!).subscribe();
      }else{
        this.srv.send(this.post!).subscribe();
      }
      this.router.navigate(['/posts']);
    }
  }

  ngOnDestroy(): void {
    this.srv.deregister();
  }
}
