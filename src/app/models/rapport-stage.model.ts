export interface Etudiant {
    id: number;
    username: string;
  }
  
  export interface RapportStage {
    id: number;
    etudiant: Etudiant;
    nomFichier: string;
    dateDepot: string; // Format ISO, sera formaté avec pipe date
  }