export class Requetes{
    static taxes="select o from ImputationShort o group by o.libelle order by o.libelle";
    static banques="select o from Banque o order by o.libelle";
    static marches="select o from Marche o order by o.idMarche";
    static typePayements="select o from TypePayement o";
    static quartiers="select distinct o.nomquartier from Rue o order by o.nomquartier";
    static professions="select o from Profession o order by o.libelle";
    static baremes="select o from Bareme o group by o.libelle order by o.libelle";
    static controleurs="select o from Utilisateur o order by o.nom";
    static naturejuridiques="select distinct o.valeur from Parametre o where o.type='nature_juridique' order by o.valeur";
    static modeleCourriers= `select o from ModeleCourrier o`;
    static listeBaremes= `select distinct new map(b as bareme,i as taxe) from BaremeShort b
                          left join ImputationShort i on i.id.idImputation=b.idImputation 
                          and i.id.anneeExercice=b.id.anExercice`;
    static listeTaxes= `select distinct i as taxe from ImputationShort i`;
    static listeMarches= `select distinct m as marche from Marche m`;
    static listeUtilisateurs= `select distinct u from Utilisateur u`;
    static listeQuartiers= `select distinct nomquartier from Rue order by nomquartier`;
    static listeRues= `select r from Rue r`;

    static listevaleursByType(typeValeur){
        return `select distinct o from Parametre o where o.type='${typeValeur}' order by o.valeur`;
    }

    static rapprochementIdoss(numeroBatch,type){
        let req=`select distinct new map(o as idoss,r as redevable,e as emplacement) from RapprochementIdoss o 
                    left join Redevable r on o.idRedevable=r.numRedevable
                    left join Emplacement e on o.idEmplacement=e.numero
                    where o.idBatchRapprochementIdoss=${numeroBatch} `;
        switch(type){
            case 'valide':req+=` and o.idEmplacement!=0 and o.rapprochementValide='true'`;break;
            case 'nonValide':req+=` and o.idEmplacement!=0 and o.rapprochementValide='false'`;break;
            case 'nonReconnu':req+=` and o.idEmplacement=0`;break;
        }
        return req;
    }

    static utilisateurById(id){
        return `select distinct o from Utilisateur o where o.numeroUser=${id}`;
    }

    static batchTraitementById(id){
        return `select distinct o from BatchTraitement o where o.id=${id}`;
    }

    static paiementById(id){
        return `select distinct new map(p as payement,r as redevable,tp as typePayement, b as banque)
        from Payement p
        left join LignePayement lp on p.id=lp.idPayement
        left join Facture f on f.idFacture=lp.idFacture
        left join RedevableShort r on f.idClient=r.numRedevable
        left join Banque b on b.id=p.idBanque
        left join TypePayement tp on tp.id=p.idTypePayement
        where p.id=${id}`;
    }

    static paiementMarcheById(id){
        return `select distinct p as payement from Payement p where p.id=${id}`;
    }

    static payementsOfFacture(idFacture):String{
        return `select distinct new map(p as payement,f as facture,tp as typePayement) 
        from Payement p
        join TypePayement tp on tp.id=p.idTypePayement
        join LignePayement lp on lp.idPayement=p.id
        join Facture f on f.idFacture=lp.idFacture
        where f.idFacture=${idFacture}`;
    }


    static modeleCourrierById(id){
        return `select distinct o from ModeleCourrier o where o.id=${id}`;
    }

    static taxesMarche=`select o from ImputationShort o
                        where o.id.anneeExercice=${new Date().getFullYear()}
                        and o.marche<>''
                        order by o.libelle`;
     
    static baremesByTaxe(idImputation){
        const anExercice=new Date().getFullYear();
        return `select o from Bareme o where o.id.anExercice=${anExercice} and o.idImputation=${idImputation}`
    }
    //Inclure nbArtcles lié au code bareme, peut pas supprimer si nbarticles >0
    static baremeById(id,annee){
        return `select distinct new map(b as bareme,i as taxe, count(a) as nbArticles) from Bareme b 
                left join ImputationShort i on i.id.idImputation=b.idImputation and i.id.anneeExercice=b.id.anExercice
                left join Article a on a.codeBareme=b.id.code and a.anExercice=b.id.anExercice
                where b.id.code=${id} and b.id.anExercice=${annee}`;
    }
    static tarifBaremeById(id,annee){
        return `select distinct tb from TarifBareme tb where tb.idBareme=${id} and tb.anExercice=${annee}`;
    }
    static droitAccesByUser(idUtilisateur){
        return `select o from DroitAcces o where idUtilisateur=${idUtilisateur}`;
    }
    static taxeShortById(id,annee){
        return `select o from ImputationShort o where o.id.idImputation=${id} and o.id.anneeExercice=${annee}`
    }
    static taxeById(id,annee){
        return `select o from Imputation o where o.id.idImputation=${id} and o.id.anneeExercice=${annee}`
    }
    static marcheById(id){
        return `select o from Marche o where o.idMarche=${id}`;
    }
    static rueById(id){
        return `select o from Rue o where o.codeVoie=${id}`;
    }
    static redevableByNumredevable(numRedevable){
        return `select new map(o as redevable,r as rue) from Redevable o 
                left join Rue r on r.codeVoie=o.codeVoie
                where o.numRedevable=${numRedevable}`;
    }
    static ruesByCode(codeRivolie){
        return `select o from Rue o Where o.codeRivolie like '${codeRivolie}%' order by o.nomrue`;
    }
    static ruesByNom(nomVoie){
        return `select o from Rue o Where o.nomrue like '%${nomVoie}%' order by o.nomrue`;
    }
    static redevablesByNom(nom){
        return `select o from Redevable o Where concat(o.prenom,o.nomRedevable) like '%${nom}%' order by o.numRedevable`;
    }

    static factureById(idFacture):string{
        return `select new map(f as facture,r as redevable,count(distinct lp) as lignePayementCount) 
                from Facture f
                join Redevable r on r.numRedevable=f.idClient
                left join LignePayement lp on f.idFacture=lp.idFacture
				left join Payement p on p.id=lp.idPayement  
                where f.idFacture=${idFacture}`;
    }

    static factureEmplacementEnCours(numRedevable):String{
        return `select new map(count(distinct e.numero) as emplacementCount, count(distinct f.numeroFacture) as factureCount) 
        from Redevable r
        left join Emplacement e on e.numRedevable=r.numRedevable
        left join Facture f on f.idClient=r.numRedevable
        where f.solde != 0 AND f.etat= 'Valide' AND e.source ='normal' AND r.numRedevable=${numRedevable}`;
    }
    
    static facturesByBatch(batchId):String{
        return  `select distinct f from Facture f 
        where f.idBatchTraitement=${batchId}
        order by f.numeroFacture`;
    }

    static facturesRedevable(numRedevable,anneeEx):String{
        return  `select distinct f from Facture f 
        left join BatchTraitement bt on bt.id=f.idBatchTraitement
        where bt.valide='true'
        and f.idClient=${numRedevable} and f.anneeEx=${anneeEx}
        order by f.numeroFacture`;
    }

    static facturesOfPayement(idPayement):String{
        return `select distinct f 
        from Payement p
        left join LignePayement lp on p.id=lp.idPayement
        left join Facture f on f.idFacture=lp.idFacture
        where p.id=${idPayement}`;
    }
/*
    static factureByCritere(key,arg1,arg2?):string{
        let clause="";
        switch(key){
            case "numero":clause=`f.numeroFacture=${arg1}`;break;
            case "titreAnnee":clause=`f.numeroTitre='${arg1}' and f.anneeTitre='${arg2}'`;break;
        }
        return`select new map(f as facture,r as redevable) 
                from Facture f
                join RedevableShort r on r.numRedevable=f.idClient 
                where ${clause} order by f.idFacture desc`;
    }
*/
    static remboursementsRedevable(numRedevable,anneeEx):String{
        return `select distinct r from Remboursement r 
        left join BatchTraitement bt on bt.id=r.idBatchTraitement
        where bt.etape='facturation'
        and r.idClient=${numRedevable} and r.anneeEx=${anneeEx}
        order by r.id desc`;
    }
    static documentsEmplacement(numero):String{
        return `select distinct de from Document_Emplacement de
        where de.idEmplacement=${numero} order by de.idDocument desc`;
    }

    static emplacement(numero){
        return `select distinct new map(e as emplacement, r as redevable,
                count(distinct a.idArticle) as nbarticle,i as taxe) from Emplacement e
        left join Redevable r on e.numRedevable=r.numRedevable
        left join ImputationShort i on i.id.idImputation=e.codeType and e.anneeExerciceImputation=i.id.anneeExercice
        left join ElementFacturation el on el.numeroEmplacement=e.numero
        left join Article a on a.idElementFacturation=el.numero and a.etat!='NePlusFacturer'
        where e.source='normal' and e.numero=${numero}`;
    }

    static nbFacturesEmplacement(numero){
        return `select count(distinct f)  from Facture f
        join LigneFacture lf on lf.idFacture=f.numeroFacture 
        join Article a on lf.idArticle=a.idArticle
        join ElementFacturation ef on ef.numero=a.idElementFacturation
        join Emplacement e on e.numero=ef.numeroEmplacement
        where a.idArticle=${numero} and f.etat!='preFacturation' and f.etat!='ANNULLEE'`;
    }

    static articleById(id){
        //année en cours
        let anExercice=new Date().getFullYear();
        return `select distinct new map(a as article,e as emplacement,
                r as redevable,i as taxe,b as bareme) from Article a
        left join ElementFacturation el on el.numero=a.idElementFacturation
        left join Emplacement e on e.numero=el.numeroEmplacement and e.source='normal'
        left join Redevable r on e.numRedevable=r.numRedevable
        left join ImputationShort i on i.id.idImputation=e.codeType and i.id.anneeExercice='${anExercice}'
        left join Bareme b on b.id.code=a.codeBareme and b.id.anExercice='${anExercice}'
        where a.idArticle=${id}`;
    }

    static nbFacturesArticle(id){
        return `select count(distinct a)  from Article a
        join LigneFacture lf on lf.idArticle=a.idArticle
        join Facture f on f.numeroFacture=lf.idFacture
        where a.idArticle=${id} and f.etat!='preFacturation' and f.etat!='ANNULLEE'`;
    }

    static historiqueEtatOuvrage(id){
        return `select o from HistoriqueEtatOuvrage o
                where o.idOuvrage=${id} order by o.id desc`;
    }

    static articlesEmplacement(numero){
         //année en cours
        let anExercice=new Date().getFullYear();
        return `select distinct new map(a as article,b as bareme) from Article a
        join ElementFacturation el on el.numero=a.idElementFacturation
        join Bareme b on b.id.code=a.codeBareme and b.id.anExercice=${anExercice}
        where a.source='normal' and el.numeroEmplacement=${numero}
        Order by a.etat`;
    }

    static photosEmplacement(numero){
        return `select distinct i from Image i
        join Image_Emplacement ie on ie.idImage=i.idImage
        where ie.idEmplacement=${numero}`;
    }

}