import { Component } from '@angular/core';
import { Adventurer, Directions } from './models';
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

  gameRulesMap: [
  {actionCode: "A", actionResult: Function},
  {actionCode: "D", actionResult: Function},
  {actionCode: "G", actionResult: Function},
  ] = [
    {
      actionCode: "A",
      actionResult: (adventurer: Adventurer) => this.moveAdventurer(adventurer)
    },
    {
      actionCode: "D",
      actionResult: (adventurer: Adventurer) => adventurer.direction = rotateRight(adventurer.direction)
    },
    {
      actionCode: "G",
      actionResult: (adventurer: Adventurer) => adventurer.direction = rotateLeft(adventurer.direction)
    }
  ];

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
    this.fileService.fileState = "PLAYED";
  }

  handleGameResetting() {
    this.treasureMapService.resetTreasureMapElements();
    this.fileService.fileState = "EMPTY";
  }

  playTreasureMapGame() {
    for (let i = 0; i < this.treasureMapService.sequenceLength; i++) {
      for (let adventurer of this.treasureMapService.adventurers) {
        this.gameRulesMap.filter(rule => rule.actionCode === adventurer.sequence[i])[0].actionResult(adventurer);
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
