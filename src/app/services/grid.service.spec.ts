import { TestBed } from '@angular/core/testing';
import { GridService } from './grid.service';
import { Cell } from '../models/cell.model';

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridService);
  });

  describe('createGrid()', () => {
    it('should create a grid with the correct number of rows', () => {
      const grid = service.createGrid(5);
      expect(grid.length).toBe(5);
    });

    it('should create a grid with the correct number of columns per row', () => {
      const grid = service.createGrid(5);
      grid.forEach((row) => expect(row.length).toBe(5));
    });

    it('should initialize all cells as inactive', () => {
      const grid = service.createGrid(5);
      grid.flat().forEach((cell) => {
        expect(cell.isActive).toBe(false);
        expect(cell.isPlayerScore).toBe(false);
        expect(cell.isComputerScore).toBe(false);
      });
    });

    it('should assign a unique id to every cell', () => {
      const grid = service.createGrid(5);
      const ids = grid.flat().map((c) => c.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it('should create a 1x1 grid', () => {
      const grid = service.createGrid(1);
      expect(grid.length).toBe(1);
      expect(grid[0].length).toBe(1);
    });

    it('should return independent row arrays (not shared references)', () => {
      const grid = service.createGrid(3);
      expect(grid[0]).not.toBe(grid[1]);
    });
  });

  describe('updateGrid()', () => {
    let grid: Cell[][];

    beforeEach(() => {
      grid = service.createGrid(3);
    });

    it('should update the specified cell with the provided properties', () => {
      const updated = service.updateGrid(grid, { isActive: true }, { rowIndex: 1, colIndex: 2 });
      expect(updated[1][2].isActive).toBe(true);
    });

    it('should not mutate the original grid', () => {
      const original = grid[1][2].isActive;
      service.updateGrid(grid, { isActive: true }, { rowIndex: 1, colIndex: 2 });
      expect(grid[1][2].isActive).toBe(original);
    });

    it('should not mutate the original row array', () => {
      const originalRow = grid[1];
      service.updateGrid(grid, { isActive: true }, { rowIndex: 1, colIndex: 2 });
      expect(grid[1]).toBe(originalRow);
    });

    it('should leave all other cells unchanged', () => {
      const updated = service.updateGrid(grid, { isActive: true }, { rowIndex: 0, colIndex: 0 });
      updated.flat().forEach((cell, i) => {
        if (i === 0) return;
        expect(cell.isActive).toBe(false);
      });
    });

    it('should preserve the cell id when updating', () => {
      const originalId = grid[0][0].id;
      const updated = service.updateGrid(grid, { isPlayerScore: true }, { rowIndex: 0, colIndex: 0 });
      expect(updated[0][0].id).toBe(originalId);
    });

    it('should allow updating multiple properties at once', () => {
      const updated = service.updateGrid(
        grid,
        { isActive: false, isComputerScore: true },
        { rowIndex: 2, colIndex: 1 },
      );
      expect(updated[2][1].isActive).toBe(false);
      expect(updated[2][1].isComputerScore).toBe(true);
    });

    it('should return a new top-level array reference', () => {
      const updated = service.updateGrid(grid, { isActive: true }, { rowIndex: 0, colIndex: 0 });
      expect(updated).not.toBe(grid);
    });
  });
});
