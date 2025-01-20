import { Injectable } from '@angular/core';
import { ActionCode, Adventurer, Coords, Treasure, TreasureMap } from '../models';
import { createCoordsFromStringArray, createDirectionFromString, formatFileLineToArray } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class TreasureMapService {
  treasureMap: TreasureMap = {width: 0, height: 0};
  mountains: Coords[] = [];
  treasures: Treasure[] = [];
  adventurers: Adventurer[] = [];
  sequenceLength = 0;

  private readonly _treasureMapBuilderElementsDescription = [
    {
      validationFunctionPredicate: (fileLine: string) => new RegExp(/^C-\d+-\d+$/i).test(fileLine),
      treasureMapElementBuilder: (treasureMapAreaAsArray: string[]) => this.buildTreasureMapArea(treasureMapAreaAsArray),
    },
    {
      validationFunctionPredicate: (fileLine: string) => new RegExp(/^M-\d+-\d+$/i).test(fileLine),
      treasureMapElementBuilder: (mountainAsArray: string[]) => this.buildMountain(mountainAsArray),
    },
    {
      validationFunctionPredicate: (fileLine: string) => new RegExp(/^T-\d+-\d+-\d+$/i).test(fileLine),
      treasureMapElementBuilder: (treasureAsArray: string[]) => this.buildTreasure(treasureAsArray),
    },
    {
      validationFunctionPredicate: (fileLine: string) => new RegExp(/^a-[a-z]+-\d+-\d+-[nesw]-[adg]+$/i).test(fileLine),
      treasureMapElementBuilder: (adventurerAsArray: string[]) => this.buildAdventurer(adventurerAsArray),
    }
  ];

  constructor() { }

  buildTreasureMapElements(fileReaderResult: string) {
    fileReaderResult.split('\n').forEach(fileLine => {
      if (fileLine.length) {
        const formattedFileLine = fileLine.replaceAll(/[\u200B-\u200D\uFEFF\s]/g, '');;
        const elementDescription = this._treasureMapBuilderElementsDescription.find(elementDescription => elementDescription.validationFunctionPredicate(formattedFileLine));
        if (!elementDescription) {
          this.resetTreasureMapElements();
          throw new Error(`Input file is not valid for entry ${fileLine}`);
        }
        elementDescription.treasureMapElementBuilder(formatFileLineToArray(fileLine))
      }
    });
  }

  resetTreasureMapElements() {
    this.treasureMap = {width: 0, height: 0};
    this.mountains = [];
    this.treasures = [];
    this.adventurers = [];
    this.sequenceLength = 0;
  }

  buildTreasureMapArea(treasureMapAreaAsArray: string[]) {
    this.treasureMap = {
      width: Number(treasureMapAreaAsArray[0]),
      height: Number(treasureMapAreaAsArray[1]),
    };
  }

  buildMountain(mountainAsArray: string[]) {
    this.mountains.push(createCoordsFromStringArray([mountainAsArray[0], mountainAsArray[1]]));
  }

  buildTreasure(treasureAsArray: string[]) {
    this.treasures.push(
      {
        coords: createCoordsFromStringArray([treasureAsArray[0], treasureAsArray[1]]),
        count: Number(treasureAsArray[2]),
      }
    );
  }

  buildAdventurer(adventurerAsArray: string[]) {
    this.sequenceLength = adventurerAsArray[4].length;
    this.adventurers.push(
      {
        name: adventurerAsArray[0],
        coords: createCoordsFromStringArray([adventurerAsArray[1], adventurerAsArray[2]]),
        direction: createDirectionFromString(adventurerAsArray[3]),
        sequence: Array.from(adventurerAsArray[4]) as ActionCode[],
        treasureCount: 0,
      }
    );
  }
}
