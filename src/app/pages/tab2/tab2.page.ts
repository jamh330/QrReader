import { Component } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  get history():any[]{
    return this.storageService.LocalHistory;
  }

  constructor(private storageService:StorageService) {}

}
