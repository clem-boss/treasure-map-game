import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';
import { TreasureMapService } from './treasure-map.service';
import { FileStates } from '../models';

describe('FileReadingService', () => {
  let service: FileService;
  let treasureMapService: TreasureMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreasureMapService]
    });
    service = TestBed.inject(FileService);
    treasureMapService = TestBed.inject(TreasureMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should call file reader read function', () => {
    const readAsTextSpy = jest.spyOn(service.reader, 'readAsText');
    const file = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });

    service.readFile(file);

    expect(readAsTextSpy).toHaveBeenCalled();
  });

  it('Should set its state to "FILE_LOADED" if file processing is successfull', () => {
    treasureMapService.buildTreasureMapElements = () => {};

    service.processFile("");

    expect(service.fileState).toBe(FileStates.FILE_LOADED);
    expect(service.error).toBeNull();
  });

  it('Should set its state to "ERROR" if file processing has thrown error', () => {
    treasureMapService.buildTreasureMapElements = () => {throw new Error()};

    service.processFile("");

    expect(service.fileState).toBe(FileStates.EMPTY);
    expect(service.error).not.toBeNull();
  });
});
