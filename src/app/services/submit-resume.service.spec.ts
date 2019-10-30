import { TestBed } from '@angular/core/testing';

import { SubmitResumeService } from './submit-resume.service';

describe('SubmitResumeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubmitResumeService = TestBed.get(SubmitResumeService);
    expect(service).toBeTruthy();
  });
});
