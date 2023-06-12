import { Component } from '@angular/core';
import { Post } from 'src/app/model/post';
import { PostsService } from 'src/app/service/posts.service';
import { OnInit , AfterContentChecked} from '@angular/core';
import { Comment } from 'src/app/model/comment';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, AfterContentChecked{

  posts: Post[];
  comments : Comment[];
  users : User[];

  constructor(private srv: PostsService, private usrv: UserService,
    private router: Router){
    this.posts = [];
    this.comments = [];
    this.users = [];
  }

  ngOnInit(): void {
        this.srv.getPosts().subscribe(items => {
          this.posts = items.reverse();
        });
        this.srv.getComments().subscribe(items => {
          this.comments = items;
        });
        this.usrv.getUsers().subscribe(items => {
          this.users = items;
        });
  }

  ngAfterContentChecked(): void {

  }

  getComments(item: Post):Comment[]{
    return this.comments.filter(c => c.postId == item.id);
  }

getUser(item:Post):User | undefined{
  return this.users.find(user => user.id == item.userId);
}

modifica(item:Post):void{
  this.srv.register(item);
  this.router.navigate(['/post']);
}

rimuovi(item:Post):void{

}



}
