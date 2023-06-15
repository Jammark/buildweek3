import { Component } from '@angular/core';
import { Post } from 'src/app/model/post';
import { PostsService } from 'src/app/service/posts.service';
import { OnInit , AfterContentChecked} from '@angular/core';
import { Comment } from 'src/app/model/comment';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, AfterContentChecked{

  posts: Post[];
  comments : Comment[];
  users : User[];
  forms: number[] =[];
  remove: number[]=[];
  removing: boolean = false;
  userId? : number;

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
        this.usrv.user$.subscribe(item => {
          this.userId = item?.id;
        });
  }

  ngAfterContentChecked(): void {
    if(this.removing){
      this.srv.post$.subscribe(item => {
        if(item){
        this.removing = false;
        this.remove.splice(this.remove.indexOf(item.id!), 1);
        }
      });
    }
  }

  getComments(item: Post):Comment[]{
    return this.comments.filter(c => c.postId == item.id).reverse().slice(0, 3);
  }

  getName(item:Comment):string | undefined{
    let name = this.users.find(user => user.email == item.email)?.name;
    return name? name : item.email;
  }

  getCommentImg(item:Comment):string | undefined{
    return this.users.find(user => user.email == item.email)?.imageUrl;
  }

getUser(item:Post):User | undefined{
  return this.users.find(user => user.id == item.userId);
}

modifica(item:Post):void{
  this.srv.register(item);
  this.router.navigate(['/post']);
}

rimuovi(item:Post):void{
  this.srv.register(item);
  this.remove.push(item.id!);
  this.srv.rimuovi(item).subscribe({
    error: (err: Error) =>{
      console.error(err);
    },
    complete: () => {
      this.srv.getPosts().subscribe(items => {
        this.posts = items.reverse();
        this.removing = true;
      });
    }
  });
}

canModify(item:Post):boolean{
  return item.userId == this.userId;
}

isRemoving(item:Post):boolean{
  if( this.remove.find(val => val == item.id)){
    return true;
  }else{
    return false;
  };
}

commenta(item:Post):void{
  this.forms.push(item.id!);
}

inviaCommento(form:NgForm, id:number){
    form.value['postId'] = id;
    this.usrv.user$.subscribe(item => {
      form.value['email'] =  item?.email;
      this.srv.addComment(form.value).subscribe({
        error: (err: Error) =>{
          console.error(err);
        },
        complete: () => {
          let index = this.forms.indexOf(id);
          this.forms.splice(index, 1);
          this.srv.getComments().subscribe(items => {
            this.comments = items;
          });
        }
      });
    });

}

}
