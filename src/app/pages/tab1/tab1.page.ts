import { AfterViewInit, Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { StorageService } from 'src/app/service/storage.service';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit{

  scanActivo:boolean=false;
  textScan:string= 'Comenzar a Escanear Codigo';
  result:any[]=[];
  
  constructor(
    private platform:Platform, 
    private alertCrtl:AlertController,
    private iab: InAppBrowser, 
    private storageService:StorageService,
    private callNumber: CallNumber,
    private openNativeSettings: OpenNativeSettings
    ) {}

  isCapacitor:boolean=this.platform.is('capacitor');

  ngAfterViewInit() {
    if(this.isCapacitor){
    BarcodeScanner.prepare();
    }
  }

  async scan(){

    if(this.isCapacitor){
      const permitido= this.checkPermisos();
      if(permitido){
        this.scanActivo=true;
        this.textScan= 'Escanee un codigo';
        const result = await BarcodeScanner.startScan();
        if(result.hasContent){

          this.result.push({'name':false,'date': new Date(),'content':result.content,'format':result.format})
     
    
          await this.storageService.saveHistory(this.result[0]);


          var urlRegex = /(https?:\/\/[^\s]+)/g;

          if(result.content.indexOf('https://zoom.') != -1){
            window.open(result.content, "_system");
          }
      
          else if(result.content.indexOf('https://wa.me') != -1){
            window.open(result.content, "_system");
          } 
          
          else if(result.content.match(urlRegex)){
            const browser = this.iab.create(result.content);
            browser.show();
          }
          
          else if(result.content.indexOf('geo') != -1){
            console.log('soy geo')
          } 
      
          else if(result.content.indexOf('tel:') != -1){
            let phone = result.content.replace('tel:','');
            this.callNumber.callNumber(phone, true)
              .then(res => console.log('Launched dialer!', res))
              .catch(err => console.log('Error launching dialer', err));
          } 
      
          else if(result.content.indexOf('mailto:') != -1){
            window.open(result.content, "_system");
          } 
      
          else if(result.content.indexOf('SMSTO:') != -1){
            console.log('soy un sms')
          } 
      
          else if(result.content.indexOf('skype:') != -1){
            console.log('soy un skype')
          }
      
          else if(result.content.indexOf('WIFI:') != -1){
            this.openNativeSettings.open("wifi")
          }
      
          else if(result.content.indexOf('BEGIN:VCARD') != -1){
            console.log('soy un vcard')
          }
      
          else if(result.content.indexOf('BEGIN:VCALENDAR') != -1){
            console.log('soy un calendar')
          }
      
          else if(result.content.indexOf('bitcoin:') != -1){
            console.log('soy un bitcoin')
          }


          this.scanActivo=false;
          this.textScan= 'Comenzar a Escanear Codigo';
          BarcodeScanner.stopScan();
          this.result=[];
          
        }
        
      }
      
    }else{
      console.log('Escaner solo disponible como aplicación en celular')
      this.textScan= 'Escaner solo disponible como aplicación en celular';
      this.scanActivo=false;
    }
  }

  async checkPermisos(){

    return new Promise(async(resolve, reject)=>{
      
      const status = await BarcodeScanner.checkPermission({force:true});
      if(status.granted){
        resolve(true);
      }else if(status.denied){
        const alert = await this.alertCrtl.create({
          header:'Sin Permisos',
          message:'Por favor permita el acceso a la camara en sus preferencias',
          buttons:[
            {
              text:'No',
              role:'cancel'
            },
            {
              text:'Abrir Preferencias',
              handler:()=>{
                BarcodeScanner.openAppSettings(),
                resolve(false)
              }
            }
        ]
        });
        await alert.present();
      }else{
        resolve(reject);
      }

    });

  }

  closeScan(){
    this.scanActivo=false;
    this.textScan= 'Comenzar a Escanear Codigo';
    BarcodeScanner.stopScan();
  }
 

}
