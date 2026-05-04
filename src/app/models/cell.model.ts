export interface Cell {
  isPlayerScore: boolean;
  isComputerScore: boolean;
  isActive: boolean;
  id: string;
}

export interface CellData {
  rowIndex: number;
  colIndex: number;
}