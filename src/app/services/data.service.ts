import { Injectable } from '@angular/core';
import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  get user(){
    return JSON.parse(sessionStorage.getItem('user'));
  }

  set user (user:User){
    sessionStorage.setItem('user',JSON.stringify(user));
  }

  get token(){
    return sessionStorage.getItem('token') || "";
  }

  set token (token:string){
    sessionStorage.setItem('token',token);
  }
/**
 * Sauvegarder la requete principale des recherches 
 */
  get requete_redevables(){
    return sessionStorage.getItem('redevables');
  }

  set requete_redevables(value:string){
    sessionStorage.setItem('redevables',value);
  }

  get requete_paiements(){
    return sessionStorage.getItem('paiements');
  }

  set requete_paiements(value:string){
    sessionStorage.setItem('paiements',value);
  }

  get requete_factures(){
    return sessionStorage.getItem('factures');
  }

  set requete_factures(value:string){
    sessionStorage.setItem('factures',value);
  }

  get requete_list_baremes(){
    return sessionStorage.getItem('list_baremes');
  }

  set requete_list_baremes(value:string){
    sessionStorage.setItem('list_baremes',value);
  }

  get requete_list_taxes(){
    return sessionStorage.getItem('list_taxes');
  }
  set requete_list_taxes(value:string){
    sessionStorage.setItem('list_taxes',value);
  }

  get requete_list_reclamations(){
    return sessionStorage.getItem('list_reclamations');
  }
  set requete_list_reclamations(value:string){
    sessionStorage.setItem('list_reclamations',value);
  }

  
  /**
   * Sauvegarde les résultats des batchs
   */
  get infoBatchTraitement(){
    return JSON.parse(sessionStorage.getItem('infoBatchTraitement'));

  }

  set infoBatchTraitement(value:any){
    sessionStorage.setItem('infoBatchTraitement',JSON.stringify(value));

  }

  get infoBatchFilien(){
    return JSON.parse(sessionStorage.getItem('infoBatchFilien'));
  }

  set infoBatchFilien(value:any){
    sessionStorage.setItem('infoBatchFilien',JSON.stringify(value));
  }
 
}
