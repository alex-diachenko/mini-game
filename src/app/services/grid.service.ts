import { Injectable } from "@angular/core";
import { Cell, CellData } from "../models/cell.model";

@Injectable({
  providedIn: "root",
})
export class GridService {
  createGrid(size: number): Cell[][] {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        isPlayerScore: false,
        isComputerScore: false,
        isActive: false,
        id: crypto.randomUUID(),
      })),
    );
  }

  updateGrid(grid: Cell[][], updateObj: Partial<Cell>, cellData: CellData): Cell[][] {
    const newGrid = [...grid];
    const newRow = [...grid[cellData.rowIndex]];
    newRow[cellData.colIndex] = { ...newRow[cellData.colIndex], ...updateObj };
    newGrid[cellData.rowIndex] = newRow;
    return newGrid;
  }
}