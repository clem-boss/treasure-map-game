import { ComponentFixture, TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular'
import { AppComponent } from './app.component';
import { TreasureMapService } from './services/treasure-map.service';
import { Directions } from './models';
import * as utils from './utils';
import { MovementValidationService } from './services/movement-validation.service';

describe('AppComponent', () => {
  let treasureMapService: TreasureMapService;
  let movementValidationService: MovementValidationService;

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        TreasureMapService,
        MovementValidationService,
      ]
    }).compileComponents();

    treasureMapService = TestBed.inject(TreasureMapService);
    movementValidationService = TestBed.inject(MovementValidationService);
    treasureMapService.sequenceLength = 1;

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create the app', () => {
    expect(component).toBeDefined();
  });

  describe('Rotation functions', () => {
    it('Should rotate right adventurer if action code is D', () => {
      const rotateRightSpy = jest.spyOn(utils, 'rotateRight');
      treasureMapService.sequenceLength = 1;
      treasureMapService.adventurers = [
        {
          name: 'Lara',
          coords: [0, 0],
          direction: Directions.NORTH,
          sequence: ['D'],
          treasureCount: 0,
        },
        {
          name: 'Lara',
          coords: [0, 0],
          direction: Directions.EAST,
          sequence: ['D'],
          treasureCount: 0,
        },
        {
          name: 'Lara',
          coords: [0, 0],
          direction: Directions.SOUTH,
          sequence: ['D'],
          treasureCount: 0,
        },
        {
          name: 'Lara',
          coords: [0, 0],
          direction: Directions.WEST,
          sequence: ['D'],
          treasureCount: 0,
        }
      ];

      component.playTreasureMapGame();

      expect(rotateRightSpy).toHaveBeenCalledTimes(4);
      expect(treasureMapService.adventurers[0].direction).toBe(Directions.EAST);
      expect(treasureMapService.adventurers[1].direction).toBe(Directions.SOUTH);
      expect(treasureMapService.adventurers[2].direction).toBe(Directions.WEST);
      expect(treasureMapService.adventurers[3].direction).toBe(Directions.NORTH);
    });

    it('Should rotate left adventurer if action code is G', () => {
      const rotateLeftSpy = jest.spyOn(utils, 'rotateLeft');
      treasureMapService.sequenceLength = 1;
      treasureMapService.adventurers = [
        {
          name: 'Lara',
          coords: [0, 0],
          direction: Directions.NORTH,
          sequence: ['G'],
          treasureCount: 0,
        },
        {
          name: 'Lara',
          coords: [0, 0],
          direction: Directions.EAST,
          sequence: ['G'],
          treasureCount: 0,
        },
        {
          name: 'Lara',
          coords: [0, 0],
          direction: Directions.SOUTH,
          sequence: ['G'],
          treasureCount: 0,
        },
        {
          name: 'Lara',
          coords: [0, 0],
          direction: Directions.WEST,
          sequence: ['G'],
          treasureCount: 0,
        }
      ];

      component.playTreasureMapGame();

      expect(rotateLeftSpy).toHaveBeenCalledTimes(4);
      expect(treasureMapService.adventurers[0].direction).toBe(Directions.WEST);
      expect(treasureMapService.adventurers[1].direction).toBe(Directions.NORTH);
      expect(treasureMapService.adventurers[2].direction).toBe(Directions.EAST);
      expect(treasureMapService.adventurers[3].direction).toBe(Directions.SOUTH);
    });
  });

  describe('Move functions', () => {
    it('Should move adventurer in any specified direction if action code is A', () => {
      const moveAdventurerSpy = jest.spyOn(component, 'moveAdventurer');
      movementValidationService.canMove = () => true;

      treasureMapService.adventurers = [
        {
          name: 'Lara',
          coords: [0, 0],
          direction: Directions.EAST,
          sequence: ['A'],
          treasureCount: 0,
        },
        {
          name: 'Lara',
          coords: [1, 0],
          direction: Directions.WEST,
          sequence: ['A'],
          treasureCount: 0,
        },
        {
          name: 'Lara',
          coords: [0, 0],
          direction: Directions.SOUTH,
          sequence: ['A'],
          treasureCount: 0,
        },
        {
          name: 'Lara',
          coords: [0, 1],
          direction: Directions.NORTH,
          sequence: ['A'],
          treasureCount: 0,
        },
      ];

      component.playTreasureMapGame();

      expect(moveAdventurerSpy).toHaveBeenCalledTimes(4);
      expect(treasureMapService.adventurers[0].coords).toEqual([1, 0]);
      expect(treasureMapService.adventurers[1].coords).toEqual([0, 0]);
      expect(treasureMapService.adventurers[2].coords).toEqual([0, 1]);
      expect(treasureMapService.adventurers[3].coords).toEqual([0, 0]);
    });
  });

  describe('Treasure picking functions', () => {
    it('Should pick one treasure if there are some', () => {
      movementValidationService.canMove = () => true;
      treasureMapService.treasures = [{coords: [1, 0], count: 1}]
      treasureMapService.adventurers = [
        {
          name: 'Lara',
          coords: [0, 0],
          direction: Directions.EAST,
          sequence: ['A'],
          treasureCount: 0,
        },
      ];

      component.playTreasureMapGame();

      expect(treasureMapService.adventurers[0].treasureCount).toBe(1);
      expect(treasureMapService.treasures[0].count).toBe(0);
    })
  });

  describe('User Events', () => {
    // it('Should trigger file reading on click', async () => {
    //   await render(AppComponent);

    //   const incrementButton = screen.getByRole('button', {name: '+'})
    //   fireEvent.click(incrementButton)

    //   expect(screen.getByText('Current Count: 6')).toBeVisible()
    // });

    // Should trigger game playing
    // Should trigger game resetting
    //
  });

  // Move functions
  // Should move adventurer if action code is A and projected position is empty
  // Should not move adventurer if action code is A but projected position is occupied

  // Treasure picking functions
  // Should pick one treasure if there are some
  // Should not pick treasure if every treasures on targeted position has been picked
});
