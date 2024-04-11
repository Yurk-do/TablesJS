import React, { useEffect, useRef } from "react";
import { jspreadsheet } from "@jspreadsheet/react";
import { license } from "../constants";
import styled from "styled-components";
import _ from "lodash";
import { CATEGORY_ROW_STYLES, TABLE_COLUMN_NAMES, TABLE_COLUMNS } from "../constants/columns";
import { ITableData, RowModel } from "../types/table";
import { FORMULAS_COLUMN_INDEX, INIT_CONFIG } from "./constants";
import { ICategoryDataForVizual } from "../types/chapter";

type PropsType = {
  categories: ITableData[];
  dataForVizual: ICategoryDataForVizual;
  editable: boolean;
  isShowFormulas: boolean;
  isShowZeroValues: boolean;
}

const StyleTableComponent = styled.div`
  position: relative;
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
  dataForVizual,
  editable,
  isShowFormulas,
  isShowZeroValues
}: PropsType) => {
  const jssRef = useRef<any | null>(null);

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
      `=IF(C${rowIndex}+F${rowIndex}=0, "", IF(C${rowIndex}=0, F${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}=1, " for " + G${rowIndex} + " days (Abroad)", IF(M${rowIndex}=2, " for " + G${rowIndex} + " weeks (Abroad)", " (Abroad)")), IF(F${rowIndex}=0, IF(M${rowIndex}=1, " for " + D${rowIndex} + " days (Germany)", IF(M${rowIndex}=2, " for " + D${rowIndex} + " weeks (Germany)", " (Germany)")), IF(N${rowIndex}=0, C${rowIndex}+F${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}=1, " for " + (D${rowIndex}+G${rowIndex}) + " days", IF(M${rowIndex}=2, " for " + (D${rowIndex}+G${rowIndex}) + " weeks", "")), C${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}=1, " for " + D${rowIndex} + " days (Germany)", IF(M${rowIndex}=2, " for " + D${rowIndex} + " weeks (Germany)", " (Germany)")) + " and " + F${rowIndex} + " x " + B${rowIndex} + IF(M${rowIndex}=1, " for " + G${rowIndex} + " days (Abroad)", IF(M${rowIndex}=2, " for " + G${rowIndex} + " weeks (Abroad)", " (Abroad)"))))))`,
    ];
  }

  const  getTableData = (categories: ITableData[], index: number = 1): InitialTableDataType => {
    const result: any[] = [];
    const categoryRows: any[] = [];
    let cells = {};
    let styles = {};
    let mergeCells = {};

    let rowIndex = index;
    categories.forEach((category) => {
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
      const _rows = category.data.map((row) => {
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

  const getColumnsConfig = (editMode: boolean) => {
    return columns.map((column: any, index: number) => {
      if (FORMULAS_COLUMN_INDEX.includes(index)) {
        column.readOnly = !editMode;
      }
      return column;
    });
  };

  useEffect(() => {
    const tableData = !categories ? initialTableData : getTableData(categories);

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
        ] as any[],
      });
  }, [categories, dataForVizual, isShowFormulas, isShowZeroValues]);

  return <StyleTableComponent ref={jssRef}></StyleTableComponent>;
};
