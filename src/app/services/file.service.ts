import { Injectable } from '@angular/core';
import { TreasureMapService } from './treasure-map.service';
import { FileStates } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  readonly reader = new FileReader();
  error!: Error | null;
  fileState = FileStates.EMPTY;

  constructor(private readonly treasureMapService: TreasureMapService) {
    this.reader.addEventListener('load', () => this.processFile(this.reader.result as string));
  }

  readFile(file: File) {
    this.reader.readAsText(file);
  }

  processFile(readerResult: string) {
    try {
      this.treasureMapService.buildTreasureMapElements(readerResult);
      this.fileState = FileStates.FILE_LOADED;
      this.error = null;
    }
    catch (error) {
      this.fileState = FileStates.EMPTY;
      this.error = error as Error;
    }
  }
}
