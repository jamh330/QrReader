import { Component } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  get history():any[]{
    return this.storageService.LocalHistory;
  }


  constructor(
    private storageService:StorageService,
    private iab: InAppBrowser, 
    private actionSheetCtr:ActionSheetController,
    private callNumber: CallNumber,
    private openNativeSettings: OpenNativeSettings,
    private alertCrtl:AlertController
    ) {}

  nameQr:string;

  

  async openMenu(url:string, name:string){

    const actionSheet = await this.actionSheetCtr.create({
      header : 'Opciones',
      buttons: [
        {
          text: 'Abrir',
          icon: 'open-outline',
          handler : ()=>this.openLink(url)
        },
        {
          text: 'Renombrar',
          icon: 'create-outline',
          handler : ()=>this.renameQr(url,name)
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

    const type = this.generaIcon(url)

    if(type=='globe'){
    const browser = this.iab.create(url);
    browser.show();
    }

    if(type=='call'){
      let phone = url.replace('tel:','');
      this.callNumber.callNumber(phone, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
    }

    if(type=='wifi'){
      //to do WifiWizard2 
      this.openNativeSettings.open("wifi")
    }

    if(type=='mail'){
      //to do WifiWizard2 
      window.open(url, "_system");
    }

    if(type=='videocam'){
      //to do WifiWizard2 
      window.open(url, "_system");
    }

    if(type=='logo-whatsapp'){
      window.open(url, "_system");
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

  async renameQr(url:string, name:string){


    let alert = await this.alertCrtl.create({
      header: 'Renombrar',
      inputs: [
        {
          name: 'nameQr',
          placeholder: 'escriba un nombre',
          value: name ? name : ''
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
            this.storageService.renameQr(url,data.nameQr);
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


}
