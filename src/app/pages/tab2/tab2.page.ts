import { Component } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Share } from '@capacitor/share';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  get history():any[]{
    return this.storageService.LocalHistory;
  }


  constructor(private storageService:StorageService,private iab: InAppBrowser, private actionSheetCtr:ActionSheetController) {}

  

  

  async openMenu(url:string){

    const actionSheet = await this.actionSheetCtr.create({
      header : 'Opciones',
      buttons: [
        {
          text: 'Abrir',
          icon: 'open-outline',
          handler : ()=>this.openLink(url)
        },
        {
          text: 'Compartir',
          icon: 'share-outline',
          handler : ()=>this.shareQr(url)
        },
        {
          text: 'Eliminar',
          icon: 'remove-circle',
          handler : ()=>this.deleteHistory(url)
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

  openLink(url:string){

    if(url.indexOf('http') != -1){
    const browser = this.iab.create(url);
    browser.show();
    }

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

  generaIcon(url:string){

    var urlRegex = /(https?:\/\/[^\s]+)/g;

    if(url.indexOf('https://zoom.') != -1){
      return 'videocam';
    }

    if(url.indexOf('https://wa.me') != -1){
      return 'logo-whatsapp';
    } 
    
    if(url.match(urlRegex)){
      return 'globe';
    }
    
    if(url.indexOf('geo') != -1){
      return 'pin';
    } 

    if(url.indexOf('tel:') != -1){
      return 'call';
    } 

    if(url.indexOf('mailto:') != -1){
      return 'mail';
    } 

    if(url.indexOf('SMSTO:') != -1){
      return 'send';
    } 

    if(url.indexOf('skype:') != -1){
      return 'logo-skype';
    }

    if(url.indexOf('WIFI:') != -1){
      return 'wifi';
    }

    if(url.indexOf('BEGIN:VCARD') != -1){
      return 'people';
    }

    if(url.indexOf('BEGIN:VCALENDAR') != -1){
      return 'calendar';
    }

    if(url.indexOf('bitcoin:') != -1){
      return 'logo-bitcoin';
    }
    
    return 'help-circle';
  }


}
