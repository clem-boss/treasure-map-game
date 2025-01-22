import { Component } from '@angular/core';
import { Adventurer, ActionCode, Directions, FileStates } from './models';
import { ReactiveFormsModule } from '@angular/forms';
import { FileService } from './services/file.service';
import { areCoordsEqual, moveDescriptionsMap, rotateLeft, rotateRight } from './utils';
import { TreasureMapService } from './services/treasure-map.service';
import { MovementValidationService } from './services/movement-validation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  fileStates = FileStates;
  directions = Directions;

  get fileState() {
    return this.fileService.fileState;
  }

  get fileError() {
    return this.fileService.error;
  }

  get treasureMapContext() {
    return {
      map: this.treasureMapService.treasureMap,
      mountains: this.treasureMapService.mountains,
      treasures: this.treasureMapService.treasures,
      adventurers: this.treasureMapService.adventurers
    }
  }

  gameRulesMap = [
    {
      actionCodePredicate: (code: ActionCode) => code === 'A',
      actionResult: (adventurer: Adventurer) => this.moveAdventurer(adventurer)
    },
    {
      actionCodePredicate: (code: ActionCode) => code === 'D',
      actionResult: (adventurer: Adventurer) => adventurer.direction = rotateRight(adventurer.direction)
    },
    {
      actionCodePredicate: (code: ActionCode) => code === 'G',
      actionResult: (adventurer: Adventurer) => adventurer.direction = rotateLeft(adventurer.direction)
    }
  ];

  // TODO create generic fileInput component
  constructor(
    private readonly fileService: FileService,
    private readonly treasureMapService: TreasureMapService,
    private readonly movementValidationService: MovementValidationService
  ) { }

  handleFileProcessing(event: Event) {
    this.fileService.readFile((event.target as HTMLInputElement).files?.[0] as File);
  }

  handleGamePlaying() {
    this.playTreasureMapGame();
    this.fileService.fileState = FileStates.FILE_PLAYED;
  }

  handleGameResetting() {
    this.treasureMapService.resetTreasureMapElements();
    this.fileService.fileState = FileStates.EMPTY;
  }

  // handleGameRulesPdfOpening() {
  //   window.open('https://bulma.io', '_blank');
  // }

  playTreasureMapGame() {
    for (let i = 0; i < this.treasureMapService.sequenceLength; i++) {
      for (let adventurer of this.treasureMapService.adventurers) {
        this.gameRulesMap.find(rule => rule.actionCodePredicate(adventurer.sequence[i]))?.actionResult(adventurer);
      }
    }
  }

  moveAdventurer(adventurer: Adventurer) {
    moveDescriptionsMap.filter(rule => rule.directionPredicate(adventurer) && this.movementValidationService.canMove(rule.coordsProjection(adventurer))).forEach(rule => {
      adventurer.coords = rule.coordsProjection(adventurer);
      this.pickTreasureIfAny(adventurer);
    });
  }

  pickTreasureIfAny(adventurer: Adventurer) {
    this.treasureMapService.treasures.filter(treasure => areCoordsEqual(treasure.coords, adventurer.coords) && Boolean(treasure.count)).some((treasure) => {
      treasure.count--;
      adventurer.treasureCount++
    });
  }
}
