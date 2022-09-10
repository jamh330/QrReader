import { AfterViewInit, Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit{

  scanActivo:boolean=false;
  textScan:string= 'Comenzar a Escanear Codigo';
  result:any[]=[];
  
  constructor(private platform:Platform, private alertCrtl:AlertController,private iab: InAppBrowser, private storageService:StorageService) {}
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

          this.result.push({'date': new Date(),'content':result.content,'format':result.format})
     
    
          await this.storageService.saveHistory(this.result[0]);

          

          if(result.content.indexOf('http') != -1){
            const browser = this.iab.create(result.content);
            browser.show();
          }else if(result.content.indexOf('geo') != -1){

          }else{
            console.log('oli no se que soy');
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
