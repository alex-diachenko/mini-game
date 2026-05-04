import { Component, input } from '@angular/core';
import { Score } from '../../../../models/score.model';

@Component({
  selector: 'app-game-score',
  imports: [],
  templateUrl: './game-score.component.html',
  styleUrl: './game-score.component.css',
})
export class GameScoreComponent {
  readonly score = input<Score>({ player: 0, computer: 0 });
}
