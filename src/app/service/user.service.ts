import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubj = new BehaviorSubject<null | User>(null); // Serve per comunicare in tempo reale all'applicazione la presenza dell'utente autenticato


  user$ = this.userSubj.asObservable();

  constructor(private http: HttpClient) { }

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(`${environment.baseURL}user`);
  }

  getUser(id:number):Observable<User>{
    return this.http.get<User>(`${environment.baseURL}user/${id}`);
  }

  salvaImmagineUtente(item: Partial<User>):Observable<boolean>{
    return this.http.patch<boolean>(`${environment.baseURL}user/${item.id}`, item);
  }

  registra(item:User):void{
    this.userSubj.next(item);
  }
}
