export type Coords = [number, number];
export type ActionCode = "A" | "D" | "G";
export type FileState = "EMPTY" | "LOADED" | "PLAYED";

export enum Directions {
  NORTH = 1,
  EAST,
  SOUTH,
  WEST,
}

export interface Adventurer {
  readonly name: string;
  sequence: ActionCode[];
  coords: Coords;
  direction: Directions;
  treasureCount: number;
}

export interface TreasureMap {
  height: number;
  width: number;
}

export interface Treasure {
  coords: Coords;
  count: number;
}
