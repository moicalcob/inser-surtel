import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDescriptionFormComponent } from './document-description-form.component';

describe('DocumentDescriptionFormComponent', () => {
  let component: DocumentDescriptionFormComponent;
  let fixture: ComponentFixture<DocumentDescriptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentDescriptionFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDescriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
