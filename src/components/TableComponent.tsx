import React, {useEffect, useRef, useState} from "react";
import { jspreadsheet } from "@jspreadsheet/react";
import { license } from "../constants";
import _ from "lodash";
import { CATEGORY_ROW_STYLES, TABLE_COLUMN_NAMES, TABLE_COLUMNS } from "../constants/columns";
import { ITableData, RowModel } from "../types/table";
import {ARROW_KEYS, FORMULAS_COLUMN_INDEX, INIT_CONFIG, UPDATE_COLUMN_INDEX_FOR_SUM} from "./constants";
import styled from "@emotion/styled";
import "jsuites/dist/jsuites.css";
import "jspreadsheet/dist/jspreadsheet.css";

type PropsType = {
  categories: ITableData[];
  visibleCategories: string[] | null;
  visibleRowsIds: number[] | null;
  editable: boolean;
  isShowFormulas: boolean;
  isShowZeroValues: boolean;
  updateChapterTotal: (total: number) => void;
  selectCell: (activeCell:  HTMLElement | null, worksheet: jspreadsheet.worksheetInstance) => void
}

const StyleTableComponent = styled.div`
  position: relative;

  & .jcontextmenu {
          position: fixed;
          z-index:10000;
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
          padding-top:4px;
          padding-bottom:4px;
          margin:0px;
          outline:none;
      
        background: black;
        color: white;
        border: 1px solid #35354e;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        div:hover {
          background-color: #7c7c80;
        }
        hr {
            border-bottom: 0;
            margin-top: 0;
            margin-bottom: 0;
        }
      
      [data-icon='red'], [data-icon='blue'], [data-icon='green'] {
          margin: 5px;
          padding: 0;
          display: inline-flex;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          
          &::before {
             display: none;
          }
      }       
      
      [data-icon='red'], [data-icon='red']:hover {
          background-color: red;
      }  
      [data-icon='blue'], [data-icon='blue']:hover {
          background-color: blue;
      }  
      [data-icon='green'], [data-icon='green']:hover {
          background-color: green;
      }
    }  
    
`;

jspreadsheet.setLicense(license)

type InitialTableDataType = {
  rows: any[],
  categoryRows: any[],
  cells: any,
  styles: any,
  mergeCells: any,
}

const initialTableData: InitialTableDataType = {
  rows: [],
  categoryRows: [],
  cells: {},
  styles: {},
  mergeCells: {},
};

export const TableComponent = ({
  categories,
  visibleCategories,
  visibleRowsIds,
  editable,
  isShowFormulas,
  isShowZeroValues,
  updateChapterTotal,
  selectCell,
}: PropsType) => {
  const jssRef = useRef<any | null>(null);
  let keydownListener: null | any = null;

  const columns = _.cloneDeep(TABLE_COLUMNS);

  const generateCategoryCells = (rowIndex: number) => {
    return TABLE_COLUMN_NAMES.reduce<Record<string, any>>((obj, colName) => {
      obj[`${colName}${rowIndex}`] = { readOnly: true, mask: '#.##0' };
      return obj;
    }, {});
  };

  const generateCategoryRow = (rowIndex: number) => {
    return TABLE_COLUMN_NAMES.reduce<Record<string, any>>((obj, colName) => {
      obj[`${colName}${rowIndex}`] = CATEGORY_ROW_STYLES;
      return obj;
    }, {});
  };

  const getRowData = (row: RowModel, rowIndex: number) => {
    return [
      row.id, //A
      row.name, //B
      row.nationalMQ || '', //C  M/Q
      row.nationalTD || '', //D  T/D
      `=ROUND((C${rowIndex} * D${rowIndex} * ${row.price} + ${row.nationalOT}) * 1.25, 0)`, //E  TOTAL €
      row.internationalMQ || '', //F  M/Q
      row.internationalTD || '', //G  T/D
      `=${row.internationalRate} * 1.25`, //H  €
      `=ROUND(${row.internationalOT}*(1+(M${rowIndex}*0.01)),0)`, //I  OT €
      `=ROUND((F${rowIndex} * G${rowIndex} * ${row.internationalRate} + ${row.internationalOT})*1.25,0)`, //J  TOTAL €
      `=ROUND(E${rowIndex}+J${rowIndex},0)`, //K  ∑ €
      row.remark || '', //L  Bemerkung
      row.count, //M  #
      row.splitting, //N  Splitten
      `=IF(C${rowIndex}+F${rowIndex}==0, "", IF(C${rowIndex}==0, F${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}==1, " for " + G${rowIndex} + " days (Abroad)", IF(M${rowIndex}==2, " for " + G${rowIndex} + " weeks (Abroad)", " (Abroad)")), IF(F${rowIndex}==0, IF(M${rowIndex}==1, " for " + D${rowIndex} + " days (Germany)", IF(M${rowIndex}==2, " for " + D${rowIndex} + " weeks (Germany)", " (Germany)")), IF(N${rowIndex}==0, C${rowIndex}+F${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}==1, " for " + (D${rowIndex}+G${rowIndex}) + " days", IF(M${rowIndex}==2, " for " + (D${rowIndex}+G${rowIndex}) + " weeks", "")), C${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}==1, " for " + D${rowIndex} + " days (Germany)", IF(M${rowIndex}==2, " for " + D${rowIndex} + " weeks (Germany)", " (Germany)")) + " and " + F${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}==1, " for " + G${rowIndex} + " days (Abroad)", IF(M${rowIndex}==2, " for " + G${rowIndex} + " weeks (Abroad)", " (Abroad)"))))))`,
    ];
  }

  const  getTableData = (categories: ITableData[], index: number = 1): InitialTableDataType => {
    const result: any[] = [];
    const categoryRows: any[] = [];
    let cells = {};
    let styles = {};
    let mergeCells = {};

    let rowIndex = index;

    const filteredCategories = visibleCategories
      ? categories.filter((category) => visibleCategories.includes(category.name))
      : categories;

    filteredCategories.forEach((category) => {
      // +1 - rich text
      const endRowIndex = category.data.length + rowIndex + 1;
      categoryRows.push({ rowIndex, endRowIndex, name: category.name });
      cells = { ...generateCategoryCells(rowIndex), ...cells };

      styles = { ...generateCategoryRow(rowIndex), ...styles };
      rowIndex = ++rowIndex;
      result.push([
        '',
        `${category.name}`,
        '',
        '',
        `=SUM(E${rowIndex}:E${endRowIndex})`,
        '',
        '',
        '',
        '',
        `=SUM(J${rowIndex}:J${endRowIndex})`,
        `=SUM(K${rowIndex}:K${endRowIndex})`,
      ]);

      const filteredRows = visibleRowsIds
        ? category.data.filter((row) => visibleRowsIds.includes(row.id))
        : category.data;

      const _rows = filteredRows.map((row) => {
        const rowData = getRowData(row, rowIndex);
        _.set(cells, `A${rowIndex}`, {
          readOnly: true,
          mask: '#.##0',
          type: 'numeric',
        });
        rowIndex = ++rowIndex;
        return rowData;
      });

      result.push(..._rows);

      //rich text editor
      result.push([category.richText]);
      rowIndex = ++rowIndex;
      const rCCellName = `A${result.length}`;
      _.set(styles, rCCellName, 'text-align: left;');
      _.set(mergeCells, rCCellName, [columns.length, 1]);
    });
    return { rows: result, categoryRows, cells, styles, mergeCells }
  };

  const [tableData, setTableData] = useState(() => !categories ? initialTableData : getTableData(categories));

  const style = {
    A1:'background-color: orange;',
    B1:'background-color: orange;',
  };

  useEffect(() => {
    setTableData(!categories ? initialTableData : getTableData(categories));
  }, [categories, isShowFormulas, isShowZeroValues, visibleCategories, visibleRowsIds]);

  const getColumnsConfig = (editMode: boolean) => {
    return columns.map((column: any, index: number) => {
      if (FORMULAS_COLUMN_INDEX.includes(index)) {
        column.readOnly = !editMode;
      }
      return column;
    });
  };

  const updateTotal = (worksheet: jspreadsheet.worksheetInstance) => {
    const result = +tableData.categoryRows
        // @ts-ignore
        .reduce((cur, categoryRow) => {
          let value: any = worksheet.getValue(`K${categoryRow.rowIndex}`, true);
          return cur + +value.replaceAll('.', '');
        }, 0)
        .toFixed(2);
    updateChapterTotal(result);
  };

  const checkIfIsCategoryRow = (checkIndex: number) => tableData.categoryRows.some(
    (row) => row.rowIndex === checkIndex
  );

  useEffect(() => {
    jssRef.current?.jspreadsheet?.[0]?.deleteWorksheet(0);

    jspreadsheet(jssRef.current, {
        editable: editable,
        worksheets: [
          {
            ...INIT_CONFIG,
            columns: getColumnsConfig(isShowFormulas),
            data: tableData.rows,
            cells: tableData.cells,
            style: tableData.styles,
            mergeCells: tableData.mergeCells,
          },
        ] as jspreadsheet.Worksheet[],
        onafterchanges: (worksheet) => {
          updateTotal(worksheet);
        },
      onerror: (err) => {
          console.log(err);
      },
        oneditionend: (worksheet, cell, x, y, newValue) => {
          if (UPDATE_COLUMN_INDEX_FOR_SUM.includes(x) && !_.isNil(newValue)) {
            const convertValue = newValue.replaceAll('.', '').replace(',', '.');
            if (Number.parseFloat(convertValue) === 0) {
              worksheet.setValueFromCoords(x, y, '');
            }
          }

          keydownListener && document.removeEventListener('keydown', keydownListener);
        },
        onchangestyle: (
          worksheet: jspreadsheet.worksheetInstance,
          newValue: object,
        ) => {
          Object.entries(newValue).forEach((el) => {
            const newValueRowIndex = Number(el[0].slice(1, el[0].length));
            const isCategoryCell = checkIfIsCategoryRow(newValueRowIndex);
            // !isCategoryCell && worksheet.resetStyle(el[0]);
          });
        },
        onselection: (
          worksheet: jspreadsheet.worksheetInstance,
          px: number,
          py: number,
          ux: number,
          uy: number,
          origin?: object
      ) => {
        if (!origin) {
          selectCell(worksheet.getCellFromCoords(px, py), worksheet);
        }
      },
      contextMenu: (o, x, y, e, items, section, section_argument1, section_argument2) => {

       const changeCellColor = (worksheet: jspreadsheet.worksheetInstance, color: string) => {
           const cells = worksheet.getSelected();

           if (cells.length) {
             cells.forEach((cell) => {
               worksheet.setStyle(`${TABLE_COLUMN_NAMES[cell.x]}${cell.y + 1}`, 'background-color',  color);
               // cell.element.style.backgroundColor = color;
             })
         }
       };

       items.push({ type: 'divisor'} as jspreadsheet.ContextmenuItem);

       const colors: jspreadsheet.ContextmenuItem[] = ['red', 'green', 'blue'].map((color) => ({ title: '', onclick: () => changeCellColor(o, color), icon: color, }))

       items = [...items, ...colors];
         return  items;
      },
      oncreateeditor: (
          worksheet: jspreadsheet.worksheetInstance,
          cell: HTMLElement,
          x: number,
          y: number,
          element: HTMLElement
      ) => {
        const cellClass = cell.getAttribute('class');
        if (cellClass && cellClass.includes('jss_richtext')) {
          const parentValues = worksheet.parent.element.getBoundingClientRect();
          const elementValues = element.getBoundingClientRect();
          const cellValues = cell.getBoundingClientRect();
          const calcTop =
              elementValues.top -
              parentValues.top +
              1 -
              elementValues.height +
              cellValues.height;
          element.style.top = calcTop > 0 ? `${calcTop}px` : '0px';
        } else {
          keydownListener = (event: KeyboardEvent) => {
            const selection = window.getSelection();
            const worksheet = jssRef.current?.jspreadsheet?.[0];
            if ([ARROW_KEYS.UP, ARROW_KEYS.DOWN].includes(event.code)) {
              worksheet.closeEditor(cell, true);
            } else if (
                event.code === ARROW_KEYS.LEFT &&
                selection?.focusOffset === 0
            ) {
              worksheet.closeEditor(cell, true);
            } else if (
                event.code === ARROW_KEYS.RIGHT &&
                selection?.anchorNode?.textContent?.length ===
                selection?.focusOffset
            ) {
              worksheet.closeEditor(cell, true);
            }
          };
          document.addEventListener('keydown', keydownListener);
        }
      },
      });
    // jssRef.current?.jspreadsheet?.[0]?.hideIndex();
    jssRef.current?.jspreadsheet?.[0]?.getData();

  }, [tableData]);


  return <StyleTableComponent ref={jssRef}></StyleTableComponent>;
};
