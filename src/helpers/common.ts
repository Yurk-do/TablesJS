import { type jspreadsheet } from '@jspreadsheet/react';
import { TABLE_COLUMN_NAMES } from '../constants/columns';
import { IChapterInfo } from '../types/table';
import { IChapter, IDataForVizual } from '../types/chapter';
import { updateData } from '../db/actions';
import { Articles, Stores } from '../db/db';
import { updateChapters, updateTableData } from '../services/tableService';

export type TableDataItemType = {
  name: any;
  dataValues: string[][] | number[][];
  dataFormulas: string[][] | number[][];
  styles: string | object;
};

export const getCellName = (cell: { x: number; y: number }) =>
  `${TABLE_COLUMN_NAMES[cell.x]}${cell.y + 1}`;

export const createDataForVizual = (
  chapters: IChapterInfo[],
  chapterList: IChapter[],
  hiddenCategories: string[],
): IDataForVizual => {
  const result = chapterList.reduce<Record<string, any>>((data, chapter) => {
    data[chapter.name] = {
      name: chapter.name,
      color: chapter.indicatorColor,
      completed: chapter.completed,
      categories: {},
      total: 0,
      initOpen: chapter.initOpen,
    };
    return data;
  }, {});

  chapters.forEach((chapter) => {
    let total = 0;
    result[chapter.name].categories = chapter.categories.reduce<
      Record<string, any>
    >((obj, category) => {
      const isCategoryCompleted = !hiddenCategories.includes(category.name);
      obj[category.name] = {
        name: category.name,
        completed: isCategoryCompleted,
      };
      total += +category.data
        .reduce((acc, row) => {
          const totalLeft = Math.round(
            (row.nationalMQ * row.nationalTD * row.price + row.nationalOT) *
              1.25,
          );
          const totalRight = Math.round(
            (row.internationalMQ * row.internationalTD * row.internationalRate +
              row.internationalOT) *
              1.25,
          );
          return acc + Math.round(totalLeft + totalRight);
        }, 0)
        .toFixed(2);
      return obj;
    }, {});
    result[chapter.name].total = total;
  });
  return result;
};

export const updateChaptersData = (
  tableData: TableDataItemType[],
  chaptersData: any[],
) => {
  const convertValueToNumber = (value: string | number) =>
    typeof value === 'number'
      ? value
      : !value.length
        ? 0
        : Number.parseFloat(value.toString().replace(',', '.'));

  tableData.forEach((tableDataItem) => {
    const chapter = chaptersData.find(
      (chapterDataItem) => chapterDataItem.name === tableDataItem.name,
    );
    if (chapter) {
      tableDataItem.dataValues.forEach((value) => {
        const rowValuesId =
          typeof value[0] === 'string' && value[0].length
            ? value[0][0] + value[0].slice(2)
            : null;
        if (Number(rowValuesId)) {
          for (let i = 0; i < chapter.categories.length; i += 1) {
            const row = chapter.categories[i].data.find(
              (categoryData: { id: string }) =>
                categoryData.id.toString() === rowValuesId,
            );
            if (!row) {
              break;
            }

            row.name = value[1]; // B
            row.nationalMQ = convertValueToNumber(value[2]); // C  M/Q
            row.nationalTD = convertValueToNumber(value[3]); // D  T/D
            row.internationalMQ = convertValueToNumber(value[5]); // F  M/Q
            row.internationalTD = convertValueToNumber(value[6]); // G  T/D
            row.remark = value[11]; // L  Bemerkung
          }
        }
      });
    }
  });
};

export const addDataHandler = async (
  data: jspreadsheet.Spreadsheet[],
  chapters: any,
) => {
  const tableData = [];

  for (let i = 0; i < data.length; i += 1) {
    const spreadsheet = data[i];
    // @ts-ignore
    const dataValues = // @ts-ignore
      (spreadsheet.worksheets?.[0] as jspreadsheet.worksheetInstance).getData(
        false,
        true,
      );
    // @ts-ignore
    const dataFormulas = // @ts-ignore
      (spreadsheet.worksheets?.[0] as jspreadsheet.worksheetInstance).getData(
        false,
        false,
      );
    // @ts-ignore
    const styles = // @ts-ignore
      (
        // @ts-ignore
        spreadsheet.worksheets?.[0] as jspreadsheet.worksheetInstance
      ).getStyle();
    // @ts-ignore
    const name = (spreadsheet as jspreadsheet.spreadsheetInstance).config.about;
    tableData.push({ name, dataValues, dataFormulas, styles });
  }

  updateChaptersData(tableData as TableDataItemType[], chapters);

  await updateData<any>(Stores.Tables, {
    name: Articles.TableData,
    data: tableData,
  });
  await updateData<any>(Stores.Tables, {
    name: Articles.Chapters,
    data: chapters,
  });
  await updateTableData(tableData);
  await updateChapters(chapters);

  return Promise.resolve();
};
