import React, {useState} from "react";
import styled from "@emotion/styled";
import { Input } from "@mui/material";
import {IconButton} from "./IconButton";
import EditIcon from '@mui/icons-material/Edit';

type PropsType = {
  name: string;
  color: string;
  onSelectTag: () => void;
  onChangeName: (name: string) => void;
};

const StyledTagComponent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const StyledTag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  cursor: pointer;
    
  & > .MuiInputBase-root.Mui-disabled  {
    cursor: pointer;
      
      & > input:disabled {
        cursor: pointer; 
      }
  }
`;

const StyledName = styled(Input)`
  font-size: 16px;
`;

const StyledColor = styled.div<{ color: string }>`
  height: 20px;
  width: 20px;
  border-radius: 100%;
  background-color: ${({ color }) => color};  
`;

export const TagComponent = ({ name, color, onSelectTag, onChangeName }: PropsType) => {
  const [isEditable, setIsEditable] = useState(false);

  const toggleEditable = () => {
    setIsEditable((prev) => !prev);
  };

  return (
    <StyledTagComponent onClick={onSelectTag}>
      <StyledTag>
        <StyledName
          disabled={!isEditable} value={name}
          onChange={(e) => onChangeName(e.target.value)}
          onBlur={() => setIsEditable(false)}
        />
        <StyledColor color={color}/>
      </StyledTag>
      <IconButton
        icon={<EditIcon/>}
        onClick={toggleEditable}
        active={isEditable}
      />
    </StyledTagComponent>
  );
};
