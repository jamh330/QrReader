import { Injectable } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { Storage } from '@ionic/storage-angular';
import { Registro } from '../Models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _history:Registro[]=[];

  get LocalHistory(){
    return [...this._history];
  }

  constructor(
    private storage: Storage,
    private iab: InAppBrowser, 
    private callNumber: CallNumber,
    private openNativeSettings: OpenNativeSettings) { 
    this.init();
  }


  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    await this.loadHistory();
  }

  async saveHistory(registro:Registro){
    const exists = this._history.find(localHistory=>localHistory.content === registro.content);
    if(!exists){
      this._history = [registro,...this._history];
      this._storage.set('history',this._history);
    }
    
  }

  abrirRegistro(registro:Registro){
    if(registro.type == 'zoom'){
      window.open(registro.content, "_system");
    }

    else if(registro.type == 'whatsapp'){
      window.open(registro.content, "_system");
    } 
    
    else if(registro.type == 'url'){
      const browser = this.iab.create(registro.content);
      browser.show();
    }
    
    else if(registro.type == 'geo'){
      console.log('soy geo')
    } 

    else if(registro.type == 'tel'){
      let phone = registro.content.replace('tel:','');
      this.callNumber.callNumber(phone, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
    } 

    else if(registro.type == 'mail'){
      window.open(registro.content, "_system");
    } 

    else if(registro.type == 'sms'){
      console.log('soy un sms')
    } 

    else if(registro.type == 'skype'){
      console.log('soy un skype')
    }

    else if(registro.type == 'wifi'){
      this.openNativeSettings.open("wifi")
    }

    else if(registro.type == 'vcard'){
      console.log('soy un vcard')
    }

    else if(registro.type == 'calendar'){
      console.log('soy un calendar')
    }

    else if(registro.type == 'bitcoin'){
      console.log('soy un bitcoin')
    }

    else{
      console.log('No soy nada')
    }
  }

  async loadHistory(){
    try {
      const history = await this._storage.get('history');
      this._history = history || [];
    } catch (error) {
      console.log(error)
    }
  }

  async removeHistory(url:string){
    this._history = this._history.filter(localHistory => localHistory.content != url);
    this._storage.set('history',this._history);
  }


  async renameQr(registro:Registro, name:string){

    const newRegistro:Registro = new Registro(registro.content,registro.format);

    const newArr = this._history.map(obj => {
      if (obj.content === registro.content) {
        return {...obj, name: name,type:newRegistro.type, icon:newRegistro.icon};
      }
    
      return obj;
    });

    //console.log(newArr)

    await this._storage.set('history',newArr);
    this.loadHistory();

}

async borrarHistorial(){
  await this._storage.clear();
  this._history = [];
}

}