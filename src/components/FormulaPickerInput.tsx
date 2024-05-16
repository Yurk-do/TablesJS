import styled from "@emotion/styled";
import { jspreadsheet } from "@jspreadsheet/react";
import { useEffect, useRef } from "react";

type PropsType = {
  label: string;
};

const StyledFormulaPickerInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;  
  gap: 8px;  
`;

const StyledFormulaPickerInput = styled.div`
  
`;

export const FormulaPickerInput = ({ label }: PropsType) => {
  const picker = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (picker.current) {
      jspreadsheet.picker(picker.current, {
        type: 'picker',
        onchange: (element: any, event: any ) => {
          console.log(element, event);
        },
        onupdate: (element: any, event: any ) => {
          console.log(element, event);
        },
      });
    }
  }, []);

  return (
    <StyledFormulaPickerInputContainer>
      <div>{label}</div>
      <StyledFormulaPickerInput ref={picker}></StyledFormulaPickerInput>
    </StyledFormulaPickerInputContainer>
  );
};
