import { Injectable } from '@angular/core';
import { TreasureMapService } from './treasure-map.service';
import { FileState } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  readonly reader = new FileReader();
  error!: Error | null;
  fileState: FileState = "EMPTY";

  constructor(private readonly treasureMapService: TreasureMapService) {
    this.reader.addEventListener('load', () => this.processFile(this.reader.result as string));
  }

  readFile(file: File) {
    this.reader.readAsText(file);
  }

  processFile(readerResult: string) {
    try {
      this.treasureMapService.buildTreasureMapElements(readerResult);
      this.fileState = "LOADED";
      this.error = null;
    }
    catch (error) {
      this.fileState = "EMPTY";
      this.error = error as Error;
    }
  }
}
