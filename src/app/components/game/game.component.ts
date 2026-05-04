import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TimeFormComponent } from './time-form/time-form.component';
import { GameGridComponent } from './game-grid/game-grid.component';
import { Cell, CellData } from '../../models/cell.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Subject,
  filter,
  take,
  map,
  timer,
  race,
  takeUntil,
  catchError,
  tap,
  EMPTY,
  switchMap,
} from 'rxjs';
import { GameScoreComponent } from '../shared/components/game-score/game-score.component';
import { Score } from '../../models/score.model';
import { MatDialog } from '@angular/material/dialog';
import { GridService } from '../../services/grid.service';
import { ScoreModalComponent } from '../shared/modals/score-modal/score-modal.component';

@Component({
  selector: 'app-game',
  imports: [TimeFormComponent, MatButtonModule, GameGridComponent, GameScoreComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly gridService = inject(GridService);
  private userClick$ = new Subject<CellData>();
  private stop$ = new Subject<void>();
  private readonly gridSize = 10;
  private readonly limitScore = 10;
  private time = 500;
  private usedCells = new Set<string>();
  isGameStarted = signal(false);
  grid = signal<Cell[][]>(this.gridService.createGrid(this.gridSize));
  score = signal<Score>({ player: 0, computer: 0 });

  startGame($event: number): void {
    this.resetGame();
    this.time = $event;
    this.isGameStarted.set(true);
    this.runNextRound();
  }

  stopGame(): void {
    this.stop$.next();
    this.isGameStarted.set(false);
    this.resetGame();
  }

  handleCellClick(rowIndex: number, colIndex: number): void {
    this.userClick$.next({ rowIndex, colIndex });
  }

  private resetGame(): void {
    this.score.set({ player: 0, computer: 0 });
    this.grid.set(this.gridService.createGrid(this.gridSize));
    this.usedCells.clear();
    this.isGameStarted.set(false);
  }

  private runNextRound(): void {
    const cellData: CellData = this.findRandomCell();
    this.grid.update((grid) =>
      this.gridService.updateGrid(grid, { isActive: true }, { rowIndex: cellData.rowIndex, colIndex: cellData.colIndex }),
    );

    const click$ = this.userClick$.pipe(
      filter((c) => c.rowIndex === cellData.rowIndex && c.colIndex === cellData.colIndex),
      take(1),
      map(() => 'player' as const),
    );

    const timeout$ = timer(this.time).pipe(map(() => 'computer' as const));

    race(click$, timeout$)
      .pipe(
        take(1),
        tap((winner: 'player' | 'computer') => {
          if (winner === 'player') {
            this.grid.update((grid) =>
              this.gridService.updateGrid(
                grid,
                { isActive: false, isPlayerScore: true },
                {rowIndex: cellData.rowIndex, colIndex: cellData.colIndex},
              ),
            );
            this.score.update((s) => ({ ...s, player: s.player + 1 }));
          } else {
            this.grid.update((grid) =>
              this.gridService.updateGrid(
                grid,
                { isActive: false, isComputerScore: true },
                {rowIndex: cellData.rowIndex, colIndex: cellData.colIndex},
              ),
            );
            this.score.update((s: Score) => ({ ...s, computer: s.computer + 1 }));
          }
        }),
        switchMap(() => {
          if (this.score().computer >= this.limitScore || this.score().player >= this.limitScore) {
            return this.dialog.open(ScoreModalComponent, { data: this.score() }).afterClosed();
          }

          this.runNextRound();
          return EMPTY;
        }),
        catchError((error: Error) => {
          console.error('Error in game logic:', error);
          return EMPTY;
        }),
        takeUntil(this.stop$),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.resetGame());
  }

  private findRandomCell(): CellData {
    const rowIndex = Math.floor(Math.random() * this.gridSize);
    const colIndex = Math.floor(Math.random() * this.gridSize);

    if (this.usedCells.has(`${rowIndex}-${colIndex}`)) {
      return this.findRandomCell();
    }
    this.usedCells.add(`${rowIndex}-${colIndex}`);
    return { rowIndex, colIndex };
  }
}
