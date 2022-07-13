/* eslint-disable @typescript-eslint/no-empty-function */
import { ReactComponent as SearchIcon } from 'assets/svg/search-icon.svg';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
const TextInputStyled = styled.input`
  all: unset;
  position: relative;
  height: 50px;
  display: flex;
  flex: 1;
  border-radius: 8px;
  border-width: 1px;

  padding-left: 15px;
  padding-right: 50px;
  background-color: ${({ theme }) => theme.primary14};
  border: 1px solid ${({ theme }) => theme.border1};
  caret-color: ${({ theme }) => theme.primary5};

  :hover {
    border: 1px solid ${({ theme }) => theme.border5};
  }

  :focus {
    border: 1px solid ${({ theme }) => theme.border5};
    color: ${({ theme }) => theme.primary5};
  }

  ::placeholder {
    flex: none;
    order: 0;
    flex-grow: 0;
    font-weight: 400;
    font-size: 16px;
    line-height: 140%;
    color: ${({ theme }) => theme.primary7};
  }
`;

const MainStyled = styled.div`
  width: 100%;
  margin-top: 15px;
  margin-bottom: 0px;

  .text-input-container {
    display: flex;
    flex-direction: row;
    align-items: center;

    .search-icon {
      position: absolute;
      right: 40px;
    }
  }
`;

interface SearchTokenBarProps {
  keySearchChange: (key: string) => void;
}
const SearchTokenBar = (props: SearchTokenBarProps) => {
  const { keySearchChange = () => {} } = props;
  const [keySearch, setKeySearch] = useState('');
  const onChange = (e: any) => {
    setKeySearch(e.target.value);
    keySearchChange && keySearchChange(e.target.value);
  };
  return (
    <MainStyled>
      <div className="text-input-container">
        <TextInputStyled
          placeholder={'Search token'}
          type={'text'}
          onChange={onChange}
          value={keySearch}
          autoFocus={false}
        />
        <SearchIcon className="search-icon" />
      </div>
    </MainStyled>
  );
};

export default React.memo(SearchTokenBar);
