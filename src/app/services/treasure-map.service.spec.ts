import { TestBed } from '@angular/core/testing';
import { TreasureMapService } from './treasure-map.service';
import { Directions } from '../models';

describe('TreasureMapService', () => {
  let service: TreasureMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreasureMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should generate treasure map area if card (C) data is valid', () => {
    const fileReaderResultMock = "C - 3 - 4";

    service.buildTreasureMapElements(fileReaderResultMock);

    expect(service.treasureMap).toEqual({width: 3, height: 4});
  });

  it('Should generate mountain if mountain (M) data is valid', () => {
    const fileReaderResultMock = "M - 0 - 0";

    service.buildTreasureMapElements(fileReaderResultMock);

    expect(service.mountains).toEqual([[0, 0]]);
  });

  it('Should generate treasure if treasure (T) data is valid', () => {
    const fileReaderResultMock = "T - 1 - 0 - 3";

    service.buildTreasureMapElements(fileReaderResultMock);

    expect(service.treasures).toEqual([{coords: [1, 0], count: 3}]);
  });

  it('Should generate adventurer if adventurer (A) data is valid', () => {
    const fileReaderResultMock = "A-Lara -1-1-S-AADADAGGA";

    service.buildTreasureMapElements(fileReaderResultMock);

    expect(service.adventurers).toEqual([
        {
          name: 'Lara',
          coords: [1, 1],
          direction: Directions.SOUTH,
          sequence: Array.from('AADADAGGA'),
          treasureCount: 0
        }
      ]);
  });

  it('Should throw error if a line from file cannot be interpreted', () => {
    expect(() => {service.buildTreasureMapElements('foo')}).toThrow(Error);
  });
});
