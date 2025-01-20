import { Injectable } from '@angular/core';
import { Coords } from '../models';
import { areCoordsEqual } from '../utils';
import { TreasureMapService } from './treasure-map.service';

@Injectable({
  providedIn: 'root'
})
export class MovementValidationService {
  constructor(private readonly treasureMapService: TreasureMapService) { }

  canMove(adventurerCoordsProjection: Coords): boolean {
    return this.hasNoMountains(adventurerCoordsProjection) &&
    this.isNotOutOfBounds(adventurerCoordsProjection) &&
    this.isNotAlreadyOccupied(adventurerCoordsProjection);
  }

  isNotAlreadyOccupied(adventurerCoordsProjection: Coords): boolean {
    return !this.treasureMapService.adventurers.some(adventurer => areCoordsEqual(adventurerCoordsProjection, adventurer.coords));
  }

  hasNoMountains(adventurerCoordsProjection: Coords): boolean {
    return !this.treasureMapService.mountains.some(mountain => areCoordsEqual(adventurerCoordsProjection, mountain));
  }

  isNotOutOfBounds(adventurerCoordsProjection: Coords): boolean {
    return !(
      adventurerCoordsProjection[0] > this.treasureMapService.treasureMap.width ||
      adventurerCoordsProjection[0] < 0 ||
      adventurerCoordsProjection[1] > this.treasureMapService.treasureMap.height ||
      adventurerCoordsProjection[1] < 0
    );
  }
}
