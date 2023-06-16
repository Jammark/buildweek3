import { Component } from '@angular/core';
import { Post } from 'src/app/model/post';
import { PostsService } from 'src/app/service/posts.service';
import { OnInit , AfterContentChecked} from '@angular/core';
import { Comment } from 'src/app/model/comment';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';

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
  comment: number[] = [];
  commenting: boolean = false;

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
        this.srv.deregister();
        }
      });
    }
    if(this.commenting){
      this.srv.post$.subscribe(item => {
          if(item){
            this.commenting = false;
            this.comment.splice(this.comment.indexOf(item.id!), 1);
            this.srv.deregister();
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

isComment(item:Post):boolean{
  return this.comment.find(val => val == item.id)? true : false;
}

commenta(item:Post):void{
  this.forms.push(item.id!);
}

 showModal(id:number){

  var myModal = new bootstrap.Modal(document.getElementById(`exampleModal${id}`) as HTMLElement);
  myModal.show();

}

inviaCommento(form:NgForm, post:Post){
    form.value['postId'] = post.id;
    this.usrv.user$.subscribe(item => {
      form.value['email'] =  item?.email;
      this.commenting = true;
      this.comment.push(post.id!);
      this.srv.addComment(form.value).subscribe({
        error: (err: Error) =>{
          console.error(err);
        },
        complete: () => {
          let index = this.forms.indexOf(post.id!);
          this.forms.splice(index, 1);
          this.srv.getComments().subscribe(items => {
            this.comments = items;
            this.srv.register(post);
          });
        }
      });
    });

}

}
