import {alpha, FormControl, InputBase, InputLabel, InputProps, Theme} from "@mui/material";
import styled from "@emotion/styled";

type PropsType = {
  label: string;
} & InputProps;

const StyledInput = styled(InputBase)`
  label + & {
    margin-top: ${({ theme }) => (theme as Theme).spacing(3)};
  }
  & .MuiInputBase-input {
      border-radius: 4px;
      position: relative;
      background-color: ${({theme}) => (theme as Theme).palette.mode === 'light' ? '#F3F6F9' : '#1A2027'};
      border: 1px solid ${({theme}) => (theme as Theme).palette.mode === 'light' ? '#E0E3E7' : '#2D3843'};
      font-size: 16px;
      width: auto;
      padding: 10px 12px;
      transition: ${({theme}) => (theme as Theme).transitions.create(['border-color',
          'background-color',
          'box-shadow',
      ])}
  }
  &:focus {
    box-shadow: ${({ theme }) => `${alpha((theme as Theme).palette.primary.main, 0.25)} 0 0 0 0.2rem}`};
    border-color: ${({ theme }) => (theme as Theme).palette.primary.main};
  }
`;

export const DialogInput = ({ label, ...otherProps }: PropsType) => {
  return (
    <FormControl variant="standard">
      <InputLabel shrink htmlFor="dialog-input">
        {label}
      </InputLabel>
      <StyledInput id="dialog-input" {...otherProps} />
    </FormControl>
  );
};
