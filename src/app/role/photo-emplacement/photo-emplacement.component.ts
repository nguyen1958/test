import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';

@Component({
  selector: 'app-photo-emplacement',
  templateUrl: './photo-emplacement.component.html',
  styleUrls: ['./photo-emplacement.component.css']
})
export class PhotoEmplacementComponent implements OnInit {
  @Input() numero;
  photos=[];
  photoIndex=0;
  showDiapo=false;
  photoSelected:File=null;
  loading=false;

  constructor(private httpService:HttpService) {}

  ngOnInit() {
    this.loadPhotos();
  }

  loadPhotos(){
    this.httpService.post("requestSql",Requetes.photosEmplacement(this.numero)).
    subscribe(data=>{
      this.photos=data;
      this.photoIndex=0;
      console.log("loadPhotos")
    });

  }

  getUrlPhoto(pathPhoto){
    return `${this.httpService.apiUrl}/showPhoto?path=${pathPhoto}`
    //return this.httpService.get(`showPhoto?path=${pathPhoto}`);
  }
  
  onPhotoSelected($event){
    this.photoSelected=<File>$event.target.files[0];  
  }

  onPhotoEnvoyer(){
      console.log("photo",this.photoSelected.size);
      const fd:FormData=new FormData();
      fd.append("file",this.photoSelected,this.photoSelected.name);
      fd.append("numero",this.numero);
      this.loading=true;
      this.httpService.post("uploadPhoto",fd).subscribe(data=>{
        console.log("retour uploadPhoto");
        this.loadPhotos();
        this.loading=false;
      });
  }

  onRemovePhoto(){
    console.log("onRemovePhoto",this.photos[this.photoIndex]);
    const fd:FormData=new FormData();
    fd.append("idImage",this.photos[this.photoIndex].idImage);
    this.httpService.post("deletePhoto",fd).subscribe(data=>{
      console.log("retour deletePhoto");
      this.loadPhotos();
    });
  }

  onShowDiapo(parameter){
    this.showDiapo=parameter;
    console.log("onShowDiapo.....")
  }

}
