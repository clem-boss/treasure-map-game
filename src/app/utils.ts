import { Directions, Coords, Adventurer } from "./models";

const stringToDirectionMap = [
  {
    directionAsString: 'N',
    direction: Directions.NORTH,
  },
  {
    directionAsString: 'E',
    direction: Directions.EAST,
  },
  {
    directionAsString: 'S',
    direction: Directions.SOUTH,
  },
  {
    directionAsString: 'W',
    direction: Directions.WEST,
  }
];

export const moveDescriptions = [
  {
    directionPredicate: (adventurer: Adventurer) => adventurer.direction === Directions.NORTH,
    coordsProjection: (adventurer: Adventurer): Coords => [adventurer.coords[0], adventurer.coords[1]-1],
  },
  {
    directionPredicate: (adventurer: Adventurer) => adventurer.direction === Directions.EAST,
    coordsProjection: (adventurer: Adventurer): Coords => [adventurer.coords[0]+1, adventurer.coords[1]],
  },
  {
    directionPredicate: (adventurer: Adventurer) => adventurer.direction === Directions.SOUTH,
    coordsProjection: (adventurer: Adventurer): Coords => [adventurer.coords[0], adventurer.coords[1]+1],
  },
  {
    directionPredicate: (adventurer: Adventurer) => adventurer.direction === Directions.WEST,
    coordsProjection: (adventurer: Adventurer): Coords => [adventurer.coords[0]-1, adventurer.coords[1]],
  },
];

export const areCoordsEqual = (coords1: Coords, coords2: Coords): boolean => {
  return coords1[0] === coords2[0] && coords1[1] === coords2[1];
}

export const rotateLeft = (direction: Directions): Directions => {
  return direction - 1 || Directions.WEST;
}

export const rotateRight = (direction: Directions): Directions => {
  return direction === Directions.WEST ? Directions.NORTH : direction + 1;
}

export const createCoordsFromStringArray = (coordsArray: [string, string]): Coords => {
  return [Number(coordsArray[0]), Number(coordsArray[1])];
}

export const createDirectionFromString = (direction: string): Directions => {
  return stringToDirectionMap.filter(map => map.directionAsString === direction)[0].direction;
}

export const formatFileLineToArray = (fileLine: string): string[] => {
  return fileLine.replace(/[^a-zA-Z\d\-:]/g, '').split('-').slice(1);
}
