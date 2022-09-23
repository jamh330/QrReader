import { AfterViewInit, Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { Registro } from 'src/app/Models/registro.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit{

  scanActivo:boolean=false;
  textScan:string= 'Toca para comenzar a Escanear';
  
  constructor(
    private platform:Platform, 
    private alertCrtl:AlertController,
    private storageService:StorageService,
    private navCtrl:NavController,
    ) {}

  isCapacitor:boolean=this.platform.is('capacitor');

  ngAfterViewInit() {
    
    if(this.isCapacitor){
    BarcodeScanner.prepare();
    }else{
      this.textScan   = 'Escaner solo disponible como aplicación en celular';
      this.scanActivo = false;
    }
  }

  async scan(){

    if(this.isCapacitor){
      const permitido   = this.checkPermisos();
      if(permitido){
        this.scanActivo = true;
        this.textScan   = 'Escanee un codigo';
        const result    = await BarcodeScanner.startScan();
        if(result.hasContent){

          const registro:Registro = new Registro(result.content,result.format);

          await this.storageService.saveHistory(registro);

          if(registro.type == 'url' || registro.type == 'geo'){
            this.storageService.abrirRegistro(registro);
          }else{
            this.navCtrl.navigateForward(`/tabs/tab2`);
          }

          this.scanActivo   = false;
          this.textScan     = 'Toca para comenzar a Escanear';
          BarcodeScanner.stopScan();
          
        }
        
      }
      
    }else{
      this.textScan   = 'Escaner solo disponible como aplicación en celular';
      this.scanActivo = false;
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
    this.scanActivo   = false;
    this.textScan     = 'Toca para comenzar a Escanear';
    BarcodeScanner.stopScan();
  }
 

}
