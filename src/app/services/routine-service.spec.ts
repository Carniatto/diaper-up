import { TestBed } from '@angular/core/testing';
import { RoutineService } from './routine-service';

describe('RoutineServiceService', () => {
  let service: RoutineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
