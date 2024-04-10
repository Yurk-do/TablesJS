import { TableComponent } from "../components/TableComponent";
import { CHAPTERS } from "../mocks/chapters";
import { IDataForVizual } from "../types/chapter";
import { chapterList } from "../mocks/chapter-mocks";
import _ from "lodash";
import { HIDDEN_CATEGORIES } from "../mocks/hidden-categories";

export const HomePage = () => {
    const hiddenCategories = _.cloneDeep(HIDDEN_CATEGORIES);
    const createDataForVizual = (): IDataForVizual => {
        const result = _.cloneDeep(chapterList).reduce<Record<string, any>>((result, chapter) => {
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

        _.cloneDeep(CHAPTERS).forEach((chapter) => {
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
    }
        return (
      <div>
        <TableComponent
          categories={CHAPTERS[0].categories}
          dataForVizual={createDataForVizual()}
          editable={true}
          isShowFormulas={true}
          isShowZeroValues={true}
        />
      </div>
  );
};