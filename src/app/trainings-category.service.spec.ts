import { TestBed } from '@angular/core/testing';

import { TrainingsCategoryService } from './trainings-category.service';

describe('TrainingsCategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingsCategoryService = TestBed.get(TrainingsCategoryService);
    expect(service).toBeTruthy();
  });
});
