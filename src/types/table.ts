export interface ToolbarSettings {
  type: string;
  content: string;
  onclick: () => void;
}

export interface TableAction {
  action: string;
  records: TableAfterChanges[];
  selection: string[];
}

export interface TableSettings {
  search?: boolean;
  pagination?: number;
  tableOverflow?: boolean;
  columnDrag?: boolean;
  defaultColWidth?: number;
  rowResize?: boolean;
  defaultColAlign?: string;
  toolbar?: ToolbarSettings[];
  onload?: () => void;
  onafterchanges?: () => void;
  allowInsertRow?: boolean;
  allowInsertColumn?: boolean;
  allowManualInsertRow?: boolean;
  allowManualInsertColumn?: boolean;
  allowDeleteRow?: boolean;
  allowDeleteColumn?: boolean;
  allowRenameColumn?: boolean;
  allowExport?: boolean;
  includeHeadersOnDownload?: boolean;
  autoIncrement?: boolean;
  tableHeight?: number | string;
  copyCompatibility?: boolean;
  stripHTMLOnCopy?: boolean;
  data?: unknown[][];
  text?: { [key: string]: string };
  stripHTML?: boolean;
  mergeCells?: { [key: string]: unknown };
  columnResize?: boolean;
  onundo?: (containerElement: HTMLElement, action: TableAction) => void;
  onredo?: (containerElement: HTMLElement, action: TableAction) => void;
  onpaste?: (containerElement: HTMLElement, data: any[]) => void;
  onbeforepaste?: (
    containerElement: HTMLElement,
    data: any[],
    x: number,
    y: number,
  ) => void;
  oncopy?: (containerElement: HTMLElement, rows: string[]) => void;
  updateTable?: (
    instance: HTMLElement,
    cell: HTMLElement,
    col: number,
    row: number,
    val: string,
    label: string,
    cellName: string,
  ) => void;
}
export interface TableAfterChanges {
  col: string;
  newValue: string;
  oldValue: string;
  row: string;
  x: string;
  y: string;
}

export interface IChapterResponse {
  items: IChapterInfo[];
}

export interface IChapterInfo {
  name: string;
  categories: ITableData[];
}

export interface ITableData {
  name: string;
  data: RowModel[];
  richText: string;
}

export interface RowModel {
  id: number;
  name: string;
  internationalMQ: number;
  internationalOT: number;
  internationalRate: number;
  internationalTD: number;
  nationalMQ: number;
  nationalOT: number;
  nationalTD: number;
  price: number;
  remark?: string; // TODO: убрать не обзательность
  count: number;
  splitting: boolean;
}

export type ColumnAlign = 'center' | 'left' | 'right';

export interface Column {
  width: string;
  align?: ColumnAlign;
  type: string;
  title: string;
  visible?: boolean;
  readOnly?: boolean;
  decimal?: '.' | ',';
  source?: string[] | number[];
  mask?: string;
}

export interface ScrollConfig {
  needBottom: number;
  needTop: number;
  needRight: number;
  needLeft: number;
}

export type CellCoords = {
  x: number;
  y: number;
};
