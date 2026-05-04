import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { vi } from 'vitest';
import { TimeFormComponent } from './time-form.component';

describe('TimeFormComponent', () => {
  let component: TimeFormComponent;
  let componentRef: ComponentRef<TimeFormComponent>;
  let fixture: ComponentFixture<TimeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  describe('initial state', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default time value of 500', () => {
      expect(component.timeForm().value().time).toBe(500);
    });

    it('should have isGameStarted as false by default', () => {
      expect(component.isGameStarted()).toBe(false);
    });

    it('should have a valid form initially', () => {
      expect(component.timeForm.time().invalid()).toBe(false);
    });
  });

  describe('form validation', () => {
    it('should be invalid when time is below the minimum', () => {
      component.timeModel.set({ time: 50 });
      component.timeForm.time().markAsTouched();
      fixture.detectChanges();
      expect(component.timeForm.time().invalid()).toBe(true);
    });

    it('should show an error message when time is too low', () => {
      component.timeModel.set({ time: 50 });
      component.timeForm.time().markAsTouched();
      fixture.detectChanges();
      const error: HTMLElement = fixture.nativeElement.querySelector('mat-error');
      expect(error?.textContent?.trim()).toContain('100');
    });

    it('should be valid when time equals the minimum', () => {
      component.timeModel.set({ time: 100 });
      fixture.detectChanges();
      expect(component.timeForm.time().invalid()).toBe(false);
    });

    it('should be invalid when time is 0', () => {
      component.timeModel.set({ time: 0 });
      component.timeForm.time().markAsTouched();
      fixture.detectChanges();
      expect(component.timeForm.time().invalid()).toBe(true);
    });
  });

  describe('button label', () => {
    it('should show "Start" when game is not started', () => {
      componentRef.setInput('isGameStarted', false);
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.textContent?.trim()).toBe('Start');
    });

    it('should show "Stop" when game is started', () => {
      componentRef.setInput('isGameStarted', true);
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.textContent?.trim()).toBe('Stop');
    });
  });

  describe('emitStartGame output', () => {
    it('should emit the current time value when game is not started', () => {
      const spy = vi.fn();
      component.emitStartGame.subscribe(spy);
      component.emitStartGameEvent();
      expect(spy).toHaveBeenCalledWith(500);
    });

    it('should emit the updated time value after model change', () => {
      const spy = vi.fn();
      component.emitStartGame.subscribe(spy);
      component.timeModel.set({ time: 300 });
      component.emitStartGameEvent();
      expect(spy).toHaveBeenCalledWith(300);
    });
  });

  describe('emitStopGame output', () => {
    it('should emit when emitStopGameEvent is called', () => {
      const spy = vi.fn();
      component.emitStopGame.subscribe(spy);
      component.emitStopGameEvent();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('button click', () => {
    it('should call emitStartGameEvent when game is not started and button is clicked', () => {
      const spy = vi.spyOn(component, 'emitStartGameEvent');
      componentRef.setInput('isGameStarted', false);
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      btn.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should call emitStopGameEvent when game is started and button is clicked', () => {
      const spy = vi.spyOn(component, 'emitStopGameEvent');
      componentRef.setInput('isGameStarted', true);
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      btn.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should disable the button when the form is invalid', () => {
      component.timeModel.set({ time: 50 });
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.disabled).toBe(true);
    });
  });

  describe('input disabled state', () => {
    it('should disable the time input when game is started', () => {
      componentRef.setInput('isGameStarted', true);
      fixture.detectChanges();
      expect(component.timeForm.time().disabled()).toBe(true);
    });

    it('should enable the time input when game is not started', () => {
      componentRef.setInput('isGameStarted', false);
      fixture.detectChanges();
      expect(component.timeForm.time().disabled()).toBe(false);
    });
  });
});
