import { Component , OnInit, OnDestroy, AfterContentChecked} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Subscription } from 'rxjs';
import { Foto } from 'src/app/model/foto';
import { AlbumService } from 'src/app/service/album.service';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.scss']
})
export class FotosComponent implements OnInit, OnDestroy, AfterContentChecked{

  photos?: Foto[];
  sub!: Subscription;
  remove: number[] = [];
  removing:boolean=false;

constructor(private router: ActivatedRoute, private srv: AlbumService,
  private rt: Router){}

  ngOnInit(): void {
   this.ricaricaLista();
  }

  ngAfterContentChecked(): void {
    if(this.removing){
      this.srv.foto$.subscribe(item => {
        if(item){
          this.removing = false;
          this.remove.splice(this.remove.indexOf(item.id!), 1);
          this.srv.deregistraFoto();
        }
      });
    }
  }

  ricaricaLista(add?:Function):void{
    this.sub = this.router.params.subscribe(params => {
      const id = +params['id'];
      this.srv.getPhotos(id).subscribe(lista => this.photos = lista.reverse());
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  modifica(item:Foto):void{
    this.srv.registraFoto(item);
    this.rt.navigate(['/albums/gestioneFoto']);
  }

  isRemoving(item:Foto):boolean{
      return this.remove.find(id => id == item.id)? true : false;
  }

  showModal(id:number){

    var myModal = new bootstrap.Modal(document.getElementById(`exampleModal${id}`) as HTMLElement);
    myModal.show();

  }

  rimuovi(item:Foto):void{
      this.remove.push(item.id!);
      this.srv.cancellaFoto(item).subscribe({
        error: err=>{
          console.error(err);
        },
        complete: ()=>{

          this.ricaricaLista(()=>{
            this.removing = true;
            this.srv.registraFoto(item);
          });

        }
      });
  }
}
