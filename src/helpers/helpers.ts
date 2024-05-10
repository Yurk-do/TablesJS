import { TABLE_COLUMN_NAMES } from "../constants/columns";

export const getCellName = (cell: { x: number, y: number }) => `${TABLE_COLUMN_NAMES[cell.x]}${cell.y + 1}`;
