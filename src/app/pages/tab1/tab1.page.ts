import { AfterViewInit, Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit{

  scanActivo:boolean=false;
  
  constructor(private platform:Platform, private alertCrtl:AlertController) {}
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
        const result = await BarcodeScanner.startScan();
        if(result.hasContent){
          console.log(result);
          this.scanActivo=false;
          console.log('oli')
        }
        
      }
      
    }else{
      console.log('Escaner solo disponible como aplicación en celular')
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

}
