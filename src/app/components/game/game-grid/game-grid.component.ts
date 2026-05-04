import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Cell, CellData } from '../../../models/cell.model';
import { GameItemComponent } from '../game-item/game-item.component';

@Component({
  selector: 'app-game-grid',
  imports: [GameItemComponent],
  templateUrl: './game-grid.component.html',
  styleUrl: './game-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameGridComponent {
  readonly gridSize = input<number>(10);
  readonly grid = input<Cell[][]>();
  readonly isPlaying = input<boolean>(false);
  readonly emitClickData = output<CellData>();

  handleCellClick(rowIndex: number, colIndex: number): void {
    if (!this.isPlaying()) return;
    this.emitClickData.emit({ rowIndex, colIndex });
  }
}
