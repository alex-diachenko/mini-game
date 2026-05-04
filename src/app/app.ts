import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GameComponent } from './components/game/game.component';

@Component({
  selector: 'app-root',
  imports: [GameComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('mini-game');
}
