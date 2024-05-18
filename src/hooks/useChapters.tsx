import { IChapter, IDataForVizual } from "../types/chapter";
import { IChapterInfo } from "../types/table";


type PropsType = {
  chapters: IChapterInfo[];
  chapterList: IChapter[];
  hiddenCategories: string[];
}

export const useChapters = ({ chapters, chapterList, hiddenCategories }: PropsType) => {

  const createDataForVizual = (): IDataForVizual => {
    const result = chapterList.reduce<Record<string, any>>((result, chapter) => {
      result[chapter.name] = {
        name: chapter.name,
        color: chapter.indicatorColor,
        completed: chapter.completed,
        categories: {},
        total: 0,
        initOpen: chapter.initOpen,
      };
      return result;
    }, {});

    chapters.forEach((chapter) => {
      let total = 0;
      result[chapter.name].categories = chapter.categories.reduce<Record<string, any>>(
        (obj, category) => {
          const isCategoryCompleted = !hiddenCategories.includes(
            category.name
          );
          obj[category.name] = {
            name: category.name,
            completed: isCategoryCompleted,
          };
          total =
            total +
            +category.data
              .reduce((acc, row) => {
                const totalLeft = Math.round(
                  (row.nationalMQ * row.nationalTD * row.price +
                    row.nationalOT) *
                  1.25
                );
                const totalRight = Math.round(
                  (row.internationalMQ *
                    row.internationalTD *
                    row.internationalRate +
                    row.internationalOT) *
                  1.25
                );
                return acc + Math.round(totalLeft + totalRight);
              }, 0)
              .toFixed(2);
          return obj;
        },
        {}
      );
      result[chapter.name].total = total;
    });
    return result;
  };


  return {
    createDataForVizual,
  }
}