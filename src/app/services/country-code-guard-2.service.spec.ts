import { TestBed } from '@angular/core/testing';

import { CountryCodeGuard2Service } from './country-code-guard-2.service';

describe('CountryCodeGuard2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CountryCodeGuard2Service = TestBed.get(CountryCodeGuard2Service);
    expect(service).toBeTruthy();
  });
});
