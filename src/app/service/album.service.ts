import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Album } from '../model/album';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Foto } from '../model/foto';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private aSubj = new BehaviorSubject<null|Album>(null);
  album$ = this.aSubj.asObservable();
  private fotoSubj = new BehaviorSubject<null|Foto>(null);
  foto$ = this.fotoSubj.asObservable();

  constructor(private http: HttpClient) { }

  getAlbums():Observable<Album[]>{
    return this.http.get<Album[]>(`${environment.baseURL}albums`);
  }

  getAlbum(id:number):Observable<Album>{
    return this.http.get<Album>(`${environment.baseURL}albums/${id}`)
  }

  getPhotos(id:number):Observable<Foto[]>{
    return this.http.get<Foto[]>(`${environment.baseURL}photos?albumId=${id}`);
  }

  updatePhoto(item:Foto):Observable<boolean>{
    return this.http.put<boolean>(`${environment.baseURL}photos/${item.id}`, item);
  }

  addPhoto(item:Partial<Foto>):Observable<boolean>{
    return this.http.post<boolean>(`${environment.baseURL}photos`, item);
  }

  cancellaFoto(item:Foto):Observable<boolean>{
    return this.http.delete<boolean>(`${environment.baseURL}photos/${item.id}`);
  }

  registraAlbum(item:Album):void{
    this.aSubj.next(item);
  }
  deregistraAlbum(){
    this.aSubj.next(null);
  }
  registraFoto(item:Foto){
    this.fotoSubj.next(item);
  }
  deregistraFoto(){
    this.fotoSubj.next(null);
  }
}
