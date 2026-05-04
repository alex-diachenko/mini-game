import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let dialogOpenSpy: ReturnType<typeof vi.fn>;

  function findActiveCell(): { rowIndex: number; colIndex: number } | null {
    const grid = component.grid();
    for (let ri = 0; ri < grid.length; ri++) {
      for (let ci = 0; ci < grid[ri].length; ci++) {
        if (grid[ri][ci].isActive) return { rowIndex: ri, colIndex: ci };
      }
    }
    return null;
  }

  beforeEach(async () => {
    vi.useFakeTimers();
    dialogOpenSpy = vi.fn().mockReturnValue({ afterClosed: () => of(undefined) });

    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        { provide: MatDialog, useValue: { open: dialogOpenSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    fixture.destroy();
  });

  describe('initial state', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have isGameStarted as false', () => {
      expect(component.isGameStarted()).toBe(false);
    });

    it('should initialize a 10x10 grid', () => {
      expect(component.grid().length).toBe(10);
      component.grid().forEach((row) => expect(row.length).toBe(10));
    });

    it('should initialize all cells as inactive', () => {
      const flagged = component
        .grid()
        .flat()
        .filter((c) => c.isActive || c.isPlayerScore || c.isComputerScore);
      expect(flagged.length).toBe(0);
    });

    it('should initialize score as 0-0', () => {
      expect(component.score()).toEqual({ player: 0, computer: 0 });
    });
  });

  describe('startGame()', () => {
    it('should set isGameStarted to true', () => {
      component.startGame(500);
      expect(component.isGameStarted()).toBe(true);
    });

    it('should activate exactly one cell', () => {
      component.startGame(500);
      const active = component.grid().flat().filter((c) => c.isActive);
      expect(active.length).toBe(1);
    });

    it('should reset score to 0-0 before starting', () => {
      component.score.set({ player: 3, computer: 5 });
      component.startGame(500);
      expect(component.score()).toEqual({ player: 0, computer: 0 });
    });
  });

  describe('stopGame()', () => {
    it('should set isGameStarted to false', () => {
      component.startGame(500);
      component.stopGame();
      expect(component.isGameStarted()).toBe(false);
    });

    it('should reset the score', () => {
      component.startGame(500);
      component.score.set({ player: 3, computer: 2 });
      component.stopGame();
      expect(component.score()).toEqual({ player: 0, computer: 0 });
    });

    it('should clear all active cells', () => {
      component.startGame(500);
      component.stopGame();
      const active = component.grid().flat().filter((c) => c.isActive);
      expect(active.length).toBe(0);
    });
  });

  describe('player wins a round', () => {
    it('should increment the player score', async () => {
      component.startGame(500);
      const cell = findActiveCell()!;
      component.handleCellClick(cell.rowIndex, cell.colIndex);
      await vi.advanceTimersByTimeAsync(0);
      expect(component.score()).toEqual({ player: 1, computer: 0 });
    });

    it('should mark the cell as player score and inactive', async () => {
      component.startGame(500);
      const { rowIndex, colIndex } = findActiveCell()!;
      component.handleCellClick(rowIndex, colIndex);
      await vi.advanceTimersByTimeAsync(0);
      expect(component.grid()[rowIndex][colIndex]).toMatchObject({
        isActive: false,
        isPlayerScore: true,
      });
    });

    it('should immediately start the next round', async () => {
      component.startGame(500);
      const first = findActiveCell()!;
      component.handleCellClick(first.rowIndex, first.colIndex);
      await vi.advanceTimersByTimeAsync(0);
      expect(findActiveCell()).not.toBeNull();
    });
  });

  describe('computer wins a round', () => {
    it('should increment the computer score after timeout', async () => {
      component.startGame(500);
      await vi.advanceTimersByTimeAsync(500);
      expect(component.score()).toEqual({ player: 0, computer: 1 });
    });

    it('should mark the cell as computer score after timeout', async () => {
      component.startGame(500);
      const { rowIndex, colIndex } = findActiveCell()!;
      await vi.advanceTimersByTimeAsync(500);
      expect(component.grid()[rowIndex][colIndex]).toMatchObject({
        isActive: false,
        isComputerScore: true,
      });
    });

    it('should use the provided time as round duration', async () => {
      component.startGame(300);
      await vi.advanceTimersByTimeAsync(299);
      expect(component.score().computer).toBe(0);
      await vi.advanceTimersByTimeAsync(1);
      expect(component.score().computer).toBe(1);
    });

    it('should start the next round after computer wins', async () => {
      component.startGame(500);
      await vi.advanceTimersByTimeAsync(500);
      expect(findActiveCell()).not.toBeNull();
    });
  });

  describe('click handling', () => {
    it('should not score when clicking a non-active cell', async () => {
      component.startGame(500);
      const { rowIndex } = findActiveCell()!;
      component.handleCellClick(rowIndex === 0 ? 1 : 0, 0);
      await vi.advanceTimersByTimeAsync(0);
      expect(component.score()).toEqual({ player: 0, computer: 0 });
    });
  });

  describe('game end', () => {
    it('should open the score dialog when player reaches the limit', async () => {
      component.startGame(500);
      component.score.set({ player: 9, computer: 0 });
      const { rowIndex, colIndex } = findActiveCell()!;
      component.handleCellClick(rowIndex, colIndex);
      await vi.advanceTimersByTimeAsync(0);
      expect(dialogOpenSpy).toHaveBeenCalled();
    });

    it('should open the score dialog when computer reaches the limit', async () => {
      component.startGame(500);
      component.score.set({ player: 0, computer: 9 });
      await vi.advanceTimersByTimeAsync(500);
      expect(dialogOpenSpy).toHaveBeenCalled();
    });

    it('should pass the final score to the dialog', async () => {
      component.startGame(500);
      component.score.set({ player: 9, computer: 0 });
      const { rowIndex, colIndex } = findActiveCell()!;
      component.handleCellClick(rowIndex, colIndex);
      await vi.advanceTimersByTimeAsync(0);
      expect(dialogOpenSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ data: { player: 10, computer: 0 } }),
      );
    });

    it('should reset the game state after the dialog closes', async () => {
      component.startGame(500);
      component.score.set({ player: 9, computer: 0 });
      const { rowIndex, colIndex } = findActiveCell()!;
      component.handleCellClick(rowIndex, colIndex);
      await vi.advanceTimersByTimeAsync(0);
      expect(component.isGameStarted()).toBe(false);
      expect(component.score()).toEqual({ player: 0, computer: 0 });
    });
  });
});
