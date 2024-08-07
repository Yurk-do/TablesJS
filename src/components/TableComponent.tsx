import React, { useEffect, useRef, useState } from 'react';
import { jspreadsheet } from '@jspreadsheet/react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { license } from '../constants';
import {
  CATEGORY_ROW_STYLES,
  TABLE_COLUMN_NAMES,
  TABLE_COLUMNS,
} from '../constants/columns';
import { CellCoords, ITableData, RowModel } from '../types/table';
import {
  ARROW_KEYS,
  FORMULAS_COLUMN_INDEX,
  INIT_CONFIG,
  UPDATE_COLUMN_INDEX_FOR_SUM,
} from './constants';
import { getCellName } from '../helpers/common';
import { defaultTagNames } from '../mocks/tags';

type PropsType = {
  name: string;
  categories: ITableData[];
  visibleCategories: string[] | null;
  selectedTagsRow: number[] | null;
  visibleRowsIds: number[] | null;
  editable: boolean;
  isShowFormulas: boolean;
  isShowZeroValues: boolean;
  setRowData: (data: any) => void;
  setCellCoords: (coords: CellCoords) => void;
  updateChapterTotal: (total: number) => void;
  openJModal: () => void;
  addTag: (tagName: string, row: number) => void;
  selectCell: (
    coords: CellCoords,
    worksheet: jspreadsheet.worksheetInstance,
    tableName: string
  ) => void;
  tagsDisplayingNames: string[];
};

const tags: jspreadsheet.ContextmenuItem = {
  title: 'tags',
  submenu: defaultTagNames.map((tagName) => ({
    title: tagName,
  })),
};

const StyleTableComponent = styled.div`
  position: relative;
  & .jcontextmenu {
    & > div:hover {
      background-color: #7c7c80;
    }
    hr {
      border-bottom: 0;
      margin-top: 0;
      margin-bottom: 0;
    }

    [data-icon='red'],
    [data-icon='blue'],
    [data-icon='green'] {
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

    [data-icon='red'],
    [data-icon='red']:hover {
      background-color: red;
    }
    [data-icon='blue'],
    [data-icon='blue']:hover {
      background-color: blue;
    }
    [data-icon='green'],
    [data-icon='green']:hover {
      background-color: green;
    }
  }

  .jss > tbody > tr > td {
    position: relative;
  }

  .jss > tbody > tr > td.tag:after {
    content: '';
    display: block;
    margin: 0 12px;
    background-color: red;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    position: absolute;
    top: 8px;
    right: 0;
  }

  .jss > tbody > tr > td.tag.tag1:after {
    background-color: red;
  }
  .jss > tbody > tr > td.tag.tag2:after {
    background-color: blue;
  }
  .jss > tbody > tr > td.tag.tag3:after {
    background-color: yellow;
  }
  .jss > tbody > tr > td.tag.tag4:after {
    background-color: green;
  }
  .jss > tbody > tr > td.tag.tag5:after {
    background-color: orange;
  }
  .jss > tbody > tr > td.tag.tag6:after {
    background-color: gray;
  }

  .jss_input.jss_nowrap.jss_focus.jss_formula {
    position: fixed;
    top: 154px !important;
    left: 50px !important;
    background-color: white !important;
    color: black;
  }
`;

jspreadsheet.setLicense(license);

type InitialTableDataType = {
  rows: any[];
  categoryRows: any[];
  cells: any;
  styles: any;
  mergeCells: any;
  rowsSettings: any;
};

const initialTableData: InitialTableDataType = {
  rows: [],
  categoryRows: [],
  cells: {},
  styles: {},
  mergeCells: {},
  rowsSettings: {},
};

export const TableComponent = ({
  name,
  categories,
  visibleCategories,
  visibleRowsIds,
  editable,
  isShowFormulas,
  isShowZeroValues,
  updateChapterTotal,
  openJModal,
  setRowData,
  setCellCoords,
  tagsDisplayingNames,
  addTag,
}: PropsType) => {
  const jssRef = useRef<any | null>(null);
  let keydownListener: null | any = null;

  const columns = _.cloneDeep(TABLE_COLUMNS);

  const generateCategoryCells = (rowIndex: number) =>
    TABLE_COLUMN_NAMES.reduce<Record<string, any>>((obj, colName) => {
      obj[`${colName}${rowIndex}`] = { readOnly: true, mask: '#.##0' };
      return obj;
    }, {});

  const generateCategoryRow = (rowIndex: number) =>
    TABLE_COLUMN_NAMES.reduce<Record<string, any>>((obj, colName) => {
      obj[`${colName}${rowIndex}`] = CATEGORY_ROW_STYLES;
      return obj;
    }, {});

  const getRowData = (row: RowModel, rowIndex: number) => [
    row.id, // A
    row.name, // B
    row.nationalMQ || '', // C  M/Q
    row.nationalTD || '', // D  T/D
    `=ROUND((C${rowIndex} * D${rowIndex} * ${row.price} + ${row.nationalOT}) * 1.25, 0)`, // E  TOTAL €
    row.internationalMQ || '', // F  M/Q
    row.internationalTD || '', // G  T/D
    `=${row.internationalRate} * 1.25`, // H  €
    `=ROUND(${row.internationalOT}*(1+(M${rowIndex}*0.01)),0)`, // I  OT €
    `=ROUND((F${rowIndex} * G${rowIndex} * ${row.internationalRate} + ${row.internationalOT})*1.25,0)`, // J  TOTAL €
    `=ROUND(E${rowIndex}+J${rowIndex},0)`, // K  ∑ €
    row.remark || '', // L  Bemerkung
    row.count, // M  #
    row.splitting, // N  Splitten
    `=IF(C${rowIndex}+F${rowIndex}==0, "", IF(C${rowIndex}==0, F${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}==1, " for " + G${rowIndex} + " days (Abroad)", IF(M${rowIndex}==2, " for " + G${rowIndex} + " weeks (Abroad)", " (Abroad)")), IF(F${rowIndex}==0, IF(M${rowIndex}==1, " for " + D${rowIndex} + " days (Germany)", IF(M${rowIndex}==2, " for " + D${rowIndex} + " weeks (Germany)", " (Germany)")), IF(N${rowIndex}==0, C${rowIndex}+F${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}==1, " for " + (D${rowIndex}+G${rowIndex}) + " days", IF(M${rowIndex}==2, " for " + (D${rowIndex}+G${rowIndex}) + " weeks", "")), C${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}==1, " for " + D${rowIndex} + " days (Germany)", IF(M${rowIndex}==2, " for " + D${rowIndex} + " weeks (Germany)", " (Germany)")) + " and " + F${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}==1, " for " + G${rowIndex} + " days (Abroad)", IF(M${rowIndex}==2, " for " + G${rowIndex} + " weeks (Abroad)", " (Abroad)"))))))`,
  ];

  const getTableData = (
    tableDataCategories: ITableData[],
    index = 1
  ): InitialTableDataType => {
    if (!tableDataCategories) {
      return initialTableData;
    }

    const result: any[] = [];
    const categoryRows: any[] = [];
    let cells = {};
    let styles = {};
    const mergeCells = {};

    let rowIndex = index;

    const filteredCategories = visibleCategories
      ? tableDataCategories.filter((category) =>
          visibleCategories.includes(category.name)
        )
      : tableDataCategories;

    filteredCategories.forEach((category) => {
      // +1 - rich text
      const endRowIndex = category.data.length + rowIndex + 1;
      categoryRows.push({ rowIndex, endRowIndex, name: category.name });
      cells = { ...generateCategoryCells(rowIndex), ...cells };

      styles = { ...generateCategoryRow(rowIndex), ...styles };
      rowIndex += 1;
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

      const rowsData = filteredRows.map((row) => {
        const rowData = getRowData(row, rowIndex);
        _.set(cells, `A${rowIndex}`, {
          readOnly: true,
          mask: '#.##0',
          type: 'numeric',
        });
        rowIndex += 1;
        return rowData;
      });

      result.push(...rowsData);

      // rich text editor
      result.push([category.richText]);
      rowIndex += 1;
    });

    const makeRowSettings = (
      size: number,
      options?: Record<number, Record<string, any>>
    ) => {
      const rowsSettings: any = {};
      for (let i = 0; i < size; i += 1) {
        rowsSettings[i] = {
          id: i,
          ...(options?.[i] ? options[i] : {}),
        };
        rowIndex += 1;
      }

      return rowsSettings;
    };

    const options = {
      0: {
        readOnly: true,
      },
      5: {
        readOnly: true,
      },
    };

    const rowsSettings: Record<number, jspreadsheet.Row> = makeRowSettings(
      result.length,
      options
    );

    /* нужно для эмуляции работы с добавлениеим нетепичных строк (может ломать фильрацию) */
    // _.set(mergeCells, 'B6', [5, 2])

    // const resultWithRowIds = result.map((resultData, index) =>
    // ({ id: index, data: [...resultData]}));

    return {
      rows: result,
      categoryRows,
      cells,
      styles,
      mergeCells,
      rowsSettings,
    };
  };

  const [tableData, setTableData] = useState(() => getTableData(categories));

  // const style = {
  //   A1: 'background-color: orange;',
  //   B1: 'background-color: orange;',
  // };

  useEffect(() => {
    setTableData(getTableData(categories));
  }, [
    categories,
    isShowFormulas,
    isShowZeroValues,
    visibleCategories,
    visibleRowsIds,
  ]);

  const getColumnsConfig = (editMode: boolean) =>
    columns.map((column: any, index: number) => {
      if (FORMULAS_COLUMN_INDEX.includes(index)) {
        column.readOnly = !editMode;
      }
      return column;
    });

  const updateTotal = (worksheet: jspreadsheet.worksheetInstance) => {
    const result = +tableData.categoryRows
      // @ts-ignore
      .reduce((cur, categoryRow) => {
        const value: any = worksheet.getValue(`K${categoryRow.rowIndex}`, true);
        return cur + +value.replaceAll('.', '');
      }, 0)
      .toFixed(2);
    updateChapterTotal(result);
  };

  // const checkIfIsCategoryRow = (checkIndex: number) =>
  //   tableData.categoryRows.some((row) => row.rowIndex === checkIndex);

  useEffect(() => {
    if (tags.submenu) {
      tags.submenu.forEach((item, index) => {
        item.title = tagsDisplayingNames[index];
      });
    }
  }, [tagsDisplayingNames]);

  useEffect(() => {
    jssRef.current?.jspreadsheet?.[0]?.deleteWorksheet(0);

    jspreadsheet(jssRef.current, {
      editable,
      about: name,
      worksheets: [
        {
          ...INIT_CONFIG,
          columns: getColumnsConfig(isShowFormulas),
          allowInsertColumn: true,
          allowDeleteColumn: true,
          allowRenameColumn: true,
          data: tableData.rows,
          rows: tableData.rowsSettings,
          cells: tableData.cells,
          style: tableData.styles,
          mergeCells: tableData.mergeCells,
        },
      ] as jspreadsheet.Worksheet[],
      onafterchanges: (worksheet) => {
        updateTotal(worksheet);
      },
      onload: (spreadsheet) => {
        // @ts-ignore
        updateTotal(spreadsheet.worksheets[0]);
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

        keydownListener &&
          document.removeEventListener('keydown', keydownListener);
      },

      onchangestyle: (
        worksheet: jspreadsheet.worksheetInstance,
        newValue: object
      ) => {
        Object.entries(newValue).forEach((el) => {
          // const newValueRowIndex = Number(el[0].slice(1, el[0].length));
          // const isCategoryCell = checkIfIsCategoryRow(newValueRowIndex);
          // !isCategoryCell && worksheet.resetStyle(el[0]);
        });
      },
      onselection: (
        worksheet: jspreadsheet.worksheetInstance,
        px: number,
        py: number
      ) => {
        if (isShowFormulas) {
          const cell = worksheet.getCell(px, py);

          cell && worksheet.openEditor(cell);
        }

        //   const coords = {x: px, y: py};
        //
        //   const tableName = jssRef.current?.jspreadsheet?.[0].parent.name;
        //
        //   selectCell(coords, worksheet, tableName);
        //
        // if (!origin) {
        //   selectCell(coords, worksheet, tableName);
        // }
      },
      contextMenu: (worksheet, x, y, __, items) => {
        // console.log(worksheet.getRow(y));
        // console.log(worksheet.getColumn(x));
        // console.log(worksheet.getProperty(x, y));
        // console.log(worksheet.getProperty(x));
        // console.log(worksheet.getValue(getCellName({ x, y }), false));

        // // Clicking in the headers
        // if (section === 'header') {
        //   // Insert a new column
        //     items.push({
        //       title: 'Insert a new column before',
        //       onclick: function () {
        //         worksheet.insertColumn(1, parseInt(section_argument1), true);
        //       }
        //     });
        //
        //     items.push({
        //       title: 'Insert a new column after',
        //       onclick: function () {
        //         worksheet.insertColumn(1, parseInt(section_argument1), false);
        //       }
        //     });
        //   // Delete a column
        //     items.push({
        //       title: 'Delete selected columns',
        //       onclick: function () {
        //         worksheet.deleteColumn(worksheet.getSelectedColumns());
        //       }
        //     });
        //   // Rename column
        //     items.push({
        //       title: 'Rename this column',
        //       onclick: function () {
        //         worksheet.setHeader(section_argument1);
        //       }
        //     });
        // }
        // console.log(items);
        //
        // return  items;

        const cells = worksheet.getSelected();

        const changeCellColor = (
          worksh: jspreadsheet.worksheetInstance,
          cellsCoords: CellCoords[],
          color: string
        ) => {
          if (cellsCoords.length) {
            cellsCoords.forEach((cell) => {
              worksh.setStyle(getCellName(cell), 'background-color', color);
              // cell.element.style.backgroundColor = color;
            });
          }
        };

        // items = [];

        items.push({
          title: 'add invoice',
          onclick: () => {
            const cell = worksheet.getSelected()[0];
            const rowData = worksheet.getRowData(cell.y, true);
            const rect = worksheet
              .getCell(cell.x, cell.y)
              ?.getBoundingClientRect();

            if (rect) {
              setCellCoords({
                x: rect.x,
                y: rect.y,
              });
            }

            setRowData(rowData);
            openJModal();
          },
        });
        items.push({
          title: 'insert row after',
          onclick: () => {
            const selectedRows = worksheet.getSelectedRows();
            let newRowNumber = y;

            const lastSelectedRowNumber = selectedRows.at(-1) as number;

            const lastSelectedRowData = worksheet.getRow(
              lastSelectedRowNumber
            ) as jspreadsheet.Row;

            if (lastSelectedRowData.readOnly) {
              const allRows = worksheet.rows as jspreadsheet.Row[];
              for (let i = lastSelectedRowNumber; i <= allRows.length; i += 1) {
                if (!allRows[i].readOnly) {
                  newRowNumber = i - 1;
                  break;
                }
                if (i === allRows.length) {
                  newRowNumber = 0;
                }
              }
            }
            worksheet.insertRow(0, newRowNumber);
          },
        });

        items.push({ type: 'divisor' } as jspreadsheet.ContextmenuItem);

        const colors: jspreadsheet.ContextmenuItem[] = [
          'red',
          'green',
          'blue',
        ].map((color) => ({
          title: '',
          onclick: () => changeCellColor(worksheet, cells, color),
          icon: color,
        }));

        const readOnlyMode: jspreadsheet.ContextmenuItem = {
          title: 'read only',
          onclick: () => {
            if (cells.length) {
              cells.forEach((cell) => {
                worksheet.setReadOnly(getCellName(cell), true);
              });
            }
          },
        };

        const save: jspreadsheet.ContextmenuItem = {
          title: 'save',
          onclick: () => {
            worksheet.download();
          },
        };

        const mergeCells: jspreadsheet.ContextmenuItem = {
          title: 'merge',
          onclick: () => {
            if (cells.length) {
              worksheet.setMerge(
                getCellName(cells[0]),
                cells.at(-1).x - cells[0].x + 1,
                cells.at(-1).y - cells[0].y + 1
              );
            }
          },
        };

        if (tags.submenu) {
          tags.submenu.forEach((tag, index) => {
            tag.onclick = () => {
              const selectedRows = worksheet.getSelectedRows();
              selectedRows.forEach((rowIndex) => {
                const tagName = `tag${index + 1}`;
                worksheet.getCell(1, rowIndex)?.classList.add('tag', tagName);
                worksheet.setMeta(
                  getCellName({ x: 1, y: rowIndex }),
                  'tag',
                  tagName
                );
                // const meta = worksheet.getMeta(
                //   getCellName({ x: 1, y: rowIndex }),
                //   'tag',
                // );
                addTag(tagName, rowIndex);
              });
            };
          });
        }
        items = [...items, ...colors, readOnlyMode, mergeCells, save, tags];
        return items;
      },
      onbeforeinsertrow: (
        // worksheet: jspreadsheet.worksheetInstance,
        // newRow: jspreadsheet.newRow[],
      ) => {
          // const newData =
          // worksheet.getRowData((newRow[0].row as number) - 1, false).map(
          // (data, index) =>
          // FORMULAS_COLUMN_INDEX.includes(index) ? data : "");
          //
          // return newRow.map((rows) => {
          //   return { ...rows, data: newData }
          // });
      },
      onbeforeinsertcolumn: (worksheet) => {
        // console.log(worksheet.getRowData(0, false));
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
            const sheet = jssRef.current?.jspreadsheet?.[0];
            if ([ARROW_KEYS.UP, ARROW_KEYS.DOWN].includes(event.code)) {
              sheet.closeEditor(cell, true);
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
  }, [tableData, name]);

  // jssRef.current?.jspreadsheet?.[0]?.getData().forEach((data: any, index: number) => {
  //   console.log(jssRef.current?.jspreadsheet?.[0].getRow(index));
  // });

  return <StyleTableComponent ref={jssRef} />;
};
