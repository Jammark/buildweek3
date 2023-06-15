import { Component , OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Foto } from 'src/app/model/foto';
import { AlbumService } from 'src/app/service/album.service';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.scss']
})
export class FotosComponent implements OnInit, OnDestroy{

  photos?: Foto[];
  sub!: Subscription;

constructor(private router: ActivatedRoute, private srv: AlbumService,
  private rt: Router){}

  ngOnInit(): void {
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
}
