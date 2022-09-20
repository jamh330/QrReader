export class Registro{

    public format   : string;
    public content  : string;
    public type     : string;
    public icon     : string;
    public name     : string;
    public date     : Date;

    constructor(content:string, format:string){
        this.format     = format;
        this.content    = content;
        this.name       = '';
        this.date       = new Date();

        this.determinarTipo();
    }

    private determinarTipo(){

        const urlRegex      = /(https?:\/\/[^\s]+)/g;
        const inicioTexto   = this.content;

       
        if(inicioTexto.indexOf('https://zoom.') != -1){
            this.type = 'zoom';
            this.icon = 'videocam';
          }
      
          else if(inicioTexto.indexOf('https://wa.me') != -1){
            this.type = 'whatsapp';
            this.icon = 'logo-whatsapp';
          } 
          
          else if(inicioTexto.match(urlRegex)){
            this.type = 'url';
            this.icon = 'globe';
          }
          
          else if(inicioTexto.indexOf('geo') != -1){
            this.type = 'geo';
            this.icon = 'pin';
          } 
      
          else if(inicioTexto.indexOf('tel:') != -1){
            this.type = 'tel';
            this.icon = 'call';
          } 
      
          else if(inicioTexto.indexOf('mailto:') != -1){
            this.type = 'mail';
            this.icon = 'mail';
          } 
      
          else if(inicioTexto.indexOf('SMSTO:') != -1){
            this.type = 'sms';
            this.icon = 'send';
          } 
      
          else if(inicioTexto.indexOf('skype:') != -1){
            this.type = 'skype';
            this.icon = 'logo-skype';
          }
      
          else if(inicioTexto.indexOf('WIFI:') != -1){
            this.type = 'wifi';
            this.icon = 'wifi';
          }
      
          else if(inicioTexto.indexOf('BEGIN:VCARD') != -1){
            this.type = 'vcard';
            this.icon = 'people';
          }
      
          else if(inicioTexto.indexOf('BEGIN:VCALENDAR') != -1){
            this.type = 'calendar';
            this.icon = 'calendar';
          }
      
          else if(inicioTexto.indexOf('bitcoin:') != -1){
            this.type = 'bitcoin';
            this.icon = 'logo-bitcoin';
          }
          else{
            this.type = 'desconocido';
            this.icon = 'help-circle';
          }


    }

}