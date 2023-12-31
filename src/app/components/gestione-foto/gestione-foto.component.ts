import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Foto } from 'src/app/model/foto';
import { AlbumService } from 'src/app/service/album.service';

@Component({
  selector: 'app-gestione-foto',
  templateUrl: './gestione-foto.component.html',
  styleUrls: ['./gestione-foto.component.scss']
})
export class GestioneFotoComponent implements OnInit, OnDestroy{

  foto?:Foto;
  carica:boolean = false;
  sub!: Subscription;

  constructor(private srv: AlbumService, private router: Router,
    private rt: ActivatedRoute){}

  submit():void{
      this.carica = true;
      if(this.foto?.id){
        this.srv.updatePhoto(this.foto).subscribe(
          {
            error: err =>{
              console.error(err);
            },
            complete: () => {
              this.router.navigate([`albums/fotos/${this.foto?.albumId}`]);
              this.carica = false;
            }
          }
        );
      }else{
        this.srv.addPhoto(this.foto!).subscribe(
          {
            error: err =>{
              console.error(err);
            },
            complete: () => {
              this.router.navigate([`albums/fotos/${this.foto?.albumId}`]);
              this.carica = false;
            }
          }
        );
      }
  }

  ngOnInit(): void {
    this.sub = this.rt.params.subscribe(params => {
      const id = +params['id'];
      this.srv.getAlbum(id).subscribe(album => {
        if(album){
          this.srv.foto$.subscribe(foto => {
            if(foto){
              this.foto = foto!;
            }else{
              this.foto = {
                title: '',
                url:'',
                albumId: album!.id
              };
              console.log(this.foto);
            }

          });
        }else{
          alert('Non puoi accedere alla pagina senza il percorso corretto!');
          this.router.navigate(['/albums']);
        }
      });
    });
/*    this.srv.album$.subscribe(album => {

  });*/
  }

  ngOnDestroy(): void {
      this.srv.deregistraFoto();
  }
}
