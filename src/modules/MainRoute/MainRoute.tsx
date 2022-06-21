import withStarted from '@modules/MainRoute/MainRoute.getStarted';
import { IRouteProps } from '@src/modules';
import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { compose } from 'recompose';
import styled, { ITheme } from 'styled-components';

import enhance from './MainRoute.enhance';
import { IProps } from './MainRoute.inteface';
const Styled = styled.div`
  background-color: ${({ theme }: { theme: ITheme }) => theme.content4};
  width: 100vw;
  height: 100vh;
`;

const MainRoute = (props: IProps & any) => {
  const { routes } = props;
  return (
    <Styled>
      <Routes>
        <Fragment>
          {routes.map((route: IRouteProps) => (
            <Route {...route} key={route.path} />
          ))}
        </Fragment>
      </Routes>
    </Styled>
  );
};

export default compose(enhance, withStarted)(React.memo(MainRoute));
