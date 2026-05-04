import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { TimeData } from '../../../models/time.model';
import { form, required, min, FormField, disabled } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-time-form',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, FormField, MatButtonModule, NgStyle],
  templateUrl: './time-form.component.html',
  styleUrl: './time-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeFormComponent {
  emitStartGame = output<number>();
  emitStopGame = output<void>();
  readonly minTime = 100;
  time = 500;
  isGameStarted = input<boolean>(false);

  timeModel = signal<TimeData>({
    time: this.time,
  });

  timeForm = form(this.timeModel, (schemaPath) => {
    required(schemaPath.time, { message: 'Time is required' });
    min(schemaPath.time, this.minTime, { message: `Time must be at least ${this.minTime}ms` });
    disabled(schemaPath.time, () => this.isGameStarted());
  });

  emitStartGameEvent() {
    this.emitStartGame.emit(this.timeForm().value().time);
  }

  emitStopGameEvent() {
    this.emitStopGame.emit();
  }
}
