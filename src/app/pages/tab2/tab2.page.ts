import { Component, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';
import { ActionSheetController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { AlertController } from '@ionic/angular';
import { Registro } from 'src/app/Models/registro.model';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  get history():Registro[]{
    return this.storageService.LocalHistory;
  }

  public createdCode:string='';
  public elementType : 'url' | 'canvas' | 'img' = 'url';

  

  constructor(
    private storageService:StorageService,
    private actionSheetCtr:ActionSheetController,
    private alertCrtl:AlertController,
    
    ) {}

   

  async openMenu(registro:Registro){

    let  textOpen = 'Abrir';

    if(registro.type=='url'){
      textOpen='Abrir Enlace'
    }
    else if(registro.type=='geo'){
      textOpen='Abrir Mapa'
    }
    else if(registro.type=='tel'){
      textOpen='Llamar'
    }
    else if(registro.type=='wifi'){
      textOpen='Abrir wifi'
    }
    else if(registro.type=='mail'){
      textOpen='Enviar Correo'
    }
    else if(registro.type=='zoom'){
      textOpen='Abrir en Zoom'
    }
    else if(registro.type=='whatsapp'){
      textOpen='Abrir en Whatsapp'
    }

    const actionSheet = await this.actionSheetCtr.create({
      header : 'Opciones',
      buttons: [
        {
          text: textOpen,
          icon: 'open-outline',
          handler : ()=>this.openLink(registro)
        },
        {
          text: 'Renombrar',
          icon: 'create-outline',
          handler : ()=>this.renameQr(registro)
        },
        {
          text: 'Ver como QR',
          icon: 'create-outline',
          handler : ()=>this.createQr(registro.content)
        },
        {
          text: 'Compartir',
          icon: 'share-outline',
          handler : ()=>this.shareQr(registro.content)
        },
        {
          text: 'Eliminar',
          icon: 'remove-circle',
          handler : ()=>this.deleteHistory(registro.content)
        },
        {
          text:'Cerrar',
          icon: 'close-outline',
          role : 'cancel'
        }
      ]
    });

    await actionSheet.present();
    
  }

  openLink(registro:Registro){

    this.storageService.abrirRegistro(registro);

  }

  async shareQr(url:string){

    await Share.share({
      title: url,
      url : url
    });

  }

  async deleteHistory(url:string){

    await this.storageService.removeHistory(url);

  }



  async renameQr(registro:Registro){

    let alert = await this.alertCrtl.create({
      header: 'Renombrar',
      inputs: [
        {
          name: 'nameQr',
          placeholder: 'escriba un nombre',
          value: registro.name ? registro.name : ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cambiar',
          handler: data => {
            this.storageService.renameQr(registro,data.nameQr);
          }
        },
      ]
    });
    alert.present();

    
  }

 async borrarHistorial(){


    let alert = await this.alertCrtl.create({
      header: '¿Vaciar todo el historial?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Si',
          handler: () => {
            this.storageService.borrarHistorial();
          }
        },
      ]
    });
    alert.present();


    
  }

  createQr(url:string){

    this.createdCode = url;
    console.log(this.createdCode);
    
  }


}
