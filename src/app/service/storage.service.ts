import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _history:any[]=[];

  get LocalHistory(){
    return [...this._history];
  }

  constructor(private storage: Storage) { 
    this.init();
  }


  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    await this.loadHistory();
  }

  async saveHistory(history:any){
    this._history = [history,...this._history];
    this._storage.set('history',this._history);
  }

  async loadHistory(){
    try {
      const history = await this._storage.get('history');
      this._history = history || [];
    } catch (error) {
      
    }
  }


}
