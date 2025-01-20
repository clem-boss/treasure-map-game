import { Component } from '@angular/core';
import { Adventurer, ActionCode, Directions, FileStates } from './models';
import { ReactiveFormsModule } from '@angular/forms';
import { FileService } from './services/file.service';
import { areCoordsEqual, moveDescriptions, rotateLeft, rotateRight } from './utils';
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
  gameRules = [
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
    protected fileService: FileService,
    protected treasureMapService: TreasureMapService,
    private readonly movementValidationService: MovementValidationService
  ) {
  }
  // TODO test with ATL
  handleFileProcessing(event: Event) {
    this.fileService.readFile((event.target as HTMLInputElement).files?.item(0) as File);
  }

  // TODO test with ATL
  handleGamePlaying() {
    this.playTreasureMapGame();
    this.fileService.fileState = FileStates.FILE_PLAYED;
  }

  // TODO test with ATL
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
        this.gameRules.find(rule => rule.actionCodePredicate(adventurer.sequence[i]))?.actionResult(adventurer);
      }
    }
  }

  moveAdventurer(adventurer: Adventurer) {
    moveDescriptions.filter(rule => rule.directionPredicate(adventurer) && this.movementValidationService.canMove(rule.coordsProjection(adventurer))).forEach(rule => {
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
