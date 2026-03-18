export interface PlaySession {
  date: string;
  players: number;
  notes?: string;
}

export interface GameSleeve {
  id: number;
  name: string; // e.g. "Main cards", "Mini cards"
  type: string; // e.g. "Mayday Premium (63×88mm)"
  needed: number; // total sleeves required for this component
  sleeved: number; // how many have actually been sleeved so far
}

export interface Game {
  id: string;
  title: string;
  bggId?: string;
  owned: boolean;
  removed: boolean;
  playLog: PlaySession[];
  sleeves: GameSleeve[];
}

export interface SleeveStock {
  id: string;
  brand: string;
  size: string;
  countInStock: number;
}

export interface PrintProject {
  id: string;
  name: string;
  gameId?: string;
  status: "planned" | "printing" | "printed";
  notes?: string;
}
