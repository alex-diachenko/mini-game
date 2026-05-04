import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Score } from '../../../../models/score.model';
import { GameScoreComponent } from '../../components/game-score/game-score.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-score-modal.component',
  imports: [
    GameScoreComponent,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './score-modal.component.html',
  styleUrl: './score-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreModalComponent {
  dialogRef = inject(MatDialogRef<ScoreModalComponent>);
  data = inject<Score>(MAT_DIALOG_DATA);

  closeDialog(): void {
    this.dialogRef.close();
  }
}
