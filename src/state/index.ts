import { configureStore } from '@reduxjs/toolkit';
import { reducer as tabs } from 'components/Core/Tabs';
import multicall from 'lib/state/multicall';
import { reducer as formReducer } from 'redux-form';
import { load, save } from 'redux-localstorage-simple';

import application from './application/reducer';
import { updateVersion } from './global/actions';
import lists from './lists/reducer';
import logs from './logs/slice';
import { routingApi } from './routing/slice';
import swap from './swap/reducer';
import token from './token/token.reducer';
import transactions from './transactions/reducer';
import user from './user/reducer';
import wallet from './wallet/reducer';

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists'];

const store = configureStore({
  reducer: {
    application,
    user,
    wallet,
    transactions,
    swap,
    multicall: multicall.reducer,
    lists,
    logs,
    token,
    [routingApi.reducerPath]: routingApi.reducer,
    tabs,
    formReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    })
      .concat(routingApi.middleware)
      .concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: process.env.NODE_ENV === 'test' }),
});

store.dispatch(updateVersion());

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppGetState = () => AppState;

export default store;
