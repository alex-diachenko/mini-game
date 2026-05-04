import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreModalComponent } from './score-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ScoreModalComponent', () => {
  let component: ScoreModalComponent;
  let fixture: ComponentFixture<ScoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
