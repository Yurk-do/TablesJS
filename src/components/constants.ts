import { TableDefaultSettings } from '../constants';

export const FORMULAS_COLUMN_INDEX = [4, 7, 8, 9, 10, 14];
export const INVOICE_COLUMN_INDEX = [0, 1];

export const UPDATE_COLUMN_INDEX_FOR_SUM = [2, 3, 5, 6];
export const INIT_CONFIG = {
  ...TableDefaultSettings,
  columnSorting: false,
  nestedHeaders: [
    [
      { title: '', colspan: 2 },
      { title: 'INLAND / NATIONAL', colspan: 3 },
      { title: 'AUSLAND / INTERNATIONAL', colspan: 10 },
    ],
  ],
  tableHeight: 'auto',
  tableWidth: '1850px',
  applyMaskOnFooters: true,
};
export const ARROW_KEYS = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
};

export const CHECK_KEYS = [
  ARROW_KEYS.UP,
  ARROW_KEYS.DOWN,
  ARROW_KEYS.LEFT,
  ARROW_KEYS.RIGHT,
];
