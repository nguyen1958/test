import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';

@Component({
  selector: 'app-document-emplacement',
  templateUrl: './document-emplacement.component.html',
  styleUrls: ['./document-emplacement.component.css']
})
export class DocumentEmplacementComponent implements OnInit {
  @Input() numero;
  documents=[];
  documentSelected:File=null;
  loading=false;
  
  constructor(private httpService:HttpService) {}

  ngOnInit() {
    this.loadDocuments();
  }

  getUrlDocument(doc){
    return `${this.httpService.apiUrl}/showFile?type=document&path=${doc.idEmplacement}/${doc.nomDocument}`
  }
  
  loadDocuments(){
    this.httpService.post("requestSql",Requetes.documentsEmplacement(this.numero))
        .subscribe(data=>this.documents=data);
  }

  onDocumentSelected($event){
    this.documentSelected=<File>$event.target.files[0];
  }

  onDocumentEnvoyer(){
    console.log("docEmplacement",this.documentSelected.size);
    const fd:FormData=new FormData();
    fd.append("file",this.documentSelected,this.documentSelected.name);
    fd.append("numero",this.numero);
    this.loading=true;
    this.httpService.post("uploadDocEmplacement",fd).subscribe(data=>{
      console.log("retour uploadDocEmplacement");
      this.loadDocuments();
      this.loading=false;
    });
  }

  onRemoveDocument(doc:any){
    console.log("onRemoveDocument",doc.idDocument,doc.nomDocument);
    const fd:FormData=new FormData();
    fd.append("idDocument",doc.idDocument);
    this.httpService.post("deleteDocument",fd).subscribe(data=>{
      console.log("retour deleteDocument");
      this.loadDocuments();
    });
  }

}
