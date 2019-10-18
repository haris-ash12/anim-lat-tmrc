import { TestBed } from '@angular/core/testing';

import { ContactAddressService } from './contact-address.service';

describe('ContactAddressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContactAddressService = TestBed.get(ContactAddressService);
    expect(service).toBeTruthy();
  });
});
