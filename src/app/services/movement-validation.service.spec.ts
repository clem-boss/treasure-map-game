import { TestBed } from '@angular/core/testing';
import { MovementValidationService } from './movement-validation.service';
import { TreasureMapService } from './treasure-map.service';
import { Coords, Directions } from '../models';

describe('MovementValidationService', () => {
  let service: MovementValidationService;
  let treasureMapService: TreasureMapService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [TreasureMapService]
    });
    service = TestBed.inject(MovementValidationService);
    treasureMapService = TestBed.inject(TreasureMapService);
    treasureMapService.treasureMap = {width: 3, height: 3};
    treasureMapService.mountains = [[0, 1]];
    treasureMapService.adventurers = [
      {
        coords: [1, 1],
        direction: Directions.EAST,
        name: 'Lara',
        sequence: ['A'],
        treasureCount: 0
      }
    ]
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("Should not move player is action code is A but there's a mountain", () => {
    const adventurerCoordsProjection = [0, 1] as Coords;

    expect(service.canMove(adventurerCoordsProjection)).toBeFalsy();
  });

  it("Should not move player if action code is A but there's another player", () => {
    const adventurerCoordsProjection = [1, 1] as Coords;

    expect(service.canMove(adventurerCoordsProjection)).toBeFalsy();
  });

  it("Should not move player if action code is A but the targeted position is out of bounds", () => {
    const adventurerCoordsProjection = [-1, 8] as Coords;

    expect(service.canMove(adventurerCoordsProjection)).toBeFalsy();
  });
});
