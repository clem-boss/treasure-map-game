export type Coords = [number, number];
export type ActionCode = 'A' | 'D' | 'G';

export enum Directions {
  NORTH = 1,
  EAST,
  SOUTH,
  WEST,
}

export enum FileStates {
  EMPTY = 1,
  FILE_LOADED,
  FILE_PLAYED,
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
