import { IChapterConf } from "../types/chapter";
import React, {ReactNode, useEffect, useMemo, useState} from "react";
import _, {isNil} from "lodash";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import styled from "@emotion/styled";
 type PropsType = {
   chapter: IChapterConf;
   isFullScreenMode?: boolean;
   changeChapterInitOpen: (chapter: IChapterConf) => void;
   children: ReactNode;
 };

 const StyledAccordionSummary = styled(AccordionSummary)`
     background: #232337;
     border-bottom: 1px solid white;
     color: white;
     & > div {
       display: flex;
       justify-content: space-between;
     }
 `;

 const StyledAccordionTitleContainer = styled.div`
   display: flex;
   align-items: center; 
   & > .accordion-title-color-indicator {
       height: 10px;
       width: 10px;
       border-radius: 100%;
       margin: 0 10px 0 5px;      
    }
 `;

 const StyledAccordionTitleColorIndicator = styled.div<{ color: string }>`
   height: 10px;
   width: 10px;
   border-radius: 100%;
   margin: 0 10px 0 5px;
   background-color: ${({ color }) => color};  
 `;

 const StyledDescriptionContainer = styled.div`
     display: flex;
     align-items: center;
     font-size: 14px;
     line-height: 17px;

     & > span + span {
         margin-left: 5px;
     }
 `;

 const StyledDescriptionTitle = styled.span`
   font-weight: 400;
   font-size: 10px;
   line-height: 12px;
   letter-spacing: 0.06em;
 `;

 const StyledDescriptionAmount = styled.span`
     font-weight: 300;
     font-size: 10px;
     line-height: 12px;
     letter-spacing: 0.06em;
 `;

 const StyledDescriptionCurrency = styled.span`
     font-weight: 700;
     font-size: 14px;  
 `;

export const Chapter = ({
  chapter,
  isFullScreenMode = true,
  changeChapterInitOpen,
  children
}: PropsType) => {

  const getChapterTotalCount = (chapter: IChapterConf): number => _.values(chapter?.categories).filter((item) => item.completed).length;

  const [totalCount, setTotalCount] = useState(getChapterTotalCount(chapter) || 0);

  const categoriesTitle = totalCount > 1 ? 'categories' : 'category';

  const chapterTotal = useMemo(
      () => Number(isNil(chapter.total) ? 0 : chapter.total).toLocaleString('de-DE'),
      [chapter.total]
  );

    useEffect(() => {
      setTotalCount(getChapterTotalCount(chapter));
    }, [chapter]);

  return (
    <div>
        <Accordion>
            <StyledAccordionSummary>
              <StyledAccordionTitleContainer>
                 {chapter?.color && <StyledAccordionTitleColorIndicator color={chapter.color}/>}
                 <span>{chapter.name}</span>
                </StyledAccordionTitleContainer>
                <StyledDescriptionContainer>
                  <StyledDescriptionTitle>TOTAL COST</StyledDescriptionTitle>
                  <StyledDescriptionAmount>
                    {`(${totalCount} ${categoriesTitle})`}
                  </StyledDescriptionAmount>
                  <StyledDescriptionCurrency>
                    {chapterTotal}
                  </StyledDescriptionCurrency>
                </StyledDescriptionContainer>
            </StyledAccordionSummary>
            <AccordionDetails>
              {children}
            </AccordionDetails>
        </Accordion>
    </div>
  );
};
