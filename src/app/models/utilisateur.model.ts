export class Utilisateur {
    id?: number;
    username?: string;
    password?: string;
    email?: string;
    role?: string;
    dateCreation?:Date;
    actif?:boolean
     
    constructor(data?: Partial<Utilisateur>) {
      if (data) {
        Object.assign(this, data);
      }
    }
  }