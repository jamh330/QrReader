import { Component } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  get history():any[]{
    return this.storageService.LocalHistory;
  }


  constructor(private storageService:StorageService,private iab: InAppBrowser) {}

  openLink(url:string){

    if(url.indexOf('http') != -1){
    const browser = this.iab.create(url);
    browser.show();
    }

  }

  deleteHistory(url:string){

    this.storageService.removeHistory(url);

  }

}
