import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-game-item',
  imports: [NgClass],
  templateUrl: './game-item.component.html',
  styleUrl: './game-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameItemComponent {
  readonly isPlayerScore = input<boolean>(false);
  readonly isComputerScore = input<boolean>(false);
  readonly isActive = input<boolean>(false);
}
