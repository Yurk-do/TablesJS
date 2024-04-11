import { TableComponent } from "../components/TableComponent";
import { CHAPTERS } from "../mocks/chapters";
import _, {isNil} from "lodash";
import { HIDDEN_CATEGORIES } from "../mocks/hidden-categories";
import { Chapter } from "../components/Chapter";
import {useMemo, useState} from "react";
import { IChapterInfo } from "../types/table";
import { IChapter, IChapterConf, IDataForVizual } from "../types/chapter";
import { chaptersList } from "../mocks/chapter-mocks";
import styled from "@emotion/styled";

const StyledMainCounterContainer = styled.div`
   width: 200px;
   height: 200px;
   border-radius: 50%;
   background-color: black;
   display: flex;
   align-items: center;
   justify-content: center; 
    margin-bottom: 20px;
`;

const StyledMainCounter = styled.div`
  font-size: 24px;  
  color: white;
  
  & > p {
    margin: 0;
  }
`;

export const HomePage = () => {
    const hiddenCategories = _.cloneDeep(HIDDEN_CATEGORIES);
    const chapterList: IChapter[] = _.cloneDeep(chaptersList);
    const chapters: IChapterInfo[] = _.cloneDeep(CHAPTERS);

    const [activeFullScreenChapter, setActiveFullScreenChapter] = useState<IChapterInfo  | null>(null);

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

    const [isFullScreenMode, setIsFullScreenMode] = useState(false);

    const [dataForVizual, setDataForVizual] = useState(createDataForVizual());


    const changeChapterInitOpen = (chapter: IChapterConf) => {
        setDataForVizual({
            ...dataForVizual,
            [chapter.name]: {
                ...dataForVizual[chapter.name],
                initOpen: false,
            },
        });
    };

    const changeFullScreenMode = (chapter: IChapterInfo | null) => {
        const chapterData = chapter ? dataForVizual[chapter.name] : null;
        setIsFullScreenMode(!!chapter);
        setActiveFullScreenChapter(chapter);
        // screenModeService.changeScreenMode(this.isFullScreenMode, chapterData);
    }

    const mainCounter = useMemo(
        () => {
          const total = Object.values(dataForVizual).reduce((result, item) => result + item.total,0);
          return Number(isNil(total) ? 0 : total).toLocaleString('de-DE');
        },
        [dataForVizual]
    );
    return (
      <div>
          <StyledMainCounterContainer>
            <StyledMainCounter>
                <p>TOTAL:</p>
                <p>{mainCounter}</p>
            </StyledMainCounter>
          </StyledMainCounterContainer>
          {CHAPTERS.map((chapter) =>
              <Chapter
                  chapter={dataForVizual[chapter.name]}
                  isFullScreenMode={isFullScreenMode}
                  changeChapterInitOpen={changeChapterInitOpen}
                  children={<div>
                      <div className="chapter-action-panel">
                          {isFullScreenMode ? (
                              <img
                                  onClick={() => changeFullScreenMode(chapter)}
                                  src="assets/open-arrows.svg"
                                  alt=""
                              />
                          ) : (
                              <img
                                  onClick={() => changeFullScreenMode(null)}
                                  src="assets/close-arrows.svg"
                                  alt=""
                              />
                          )}
                          <div className="category-menu">
                          </div>
                      </div>
                      <div className="tables-container">
                          <TableComponent
                              key={chapter.name}
                              categories={chapter.categories}
                              dataForVizual={createDataForVizual()}
                              editable={true}
                              isShowFormulas={true}
                              isShowZeroValues={true}
                          />
                      </div>
                  </div>}
              />
          )
          }
      </div>
    )
        ;
};