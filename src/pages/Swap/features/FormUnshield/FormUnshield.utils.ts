import { BigNumber } from 'bignumber.js';
import { MAIN_NETWORK_NAME } from 'constants/token';
import { ITokenNetwork } from 'models/model/pTokenModel';
import SelectedPrivacy from 'models/model/SelectedPrivacyModel';
import { FORM_CONFIGS } from 'pages/Swap/Swap.constant';
import { formValueSelector, isSubmitting, isValid } from 'redux-form';
import { AppState } from 'state';
import { unshieldableTokens } from 'state/token';

import convert from '../../../../utils/convert';
import { IFormUnshieldReducer } from './FormUnshield.types';
const { isPaymentAddress } = require('incognito-chain-web-js/build/web/wallet');

export interface IUnshieldData {
  unshieldAddress: string;

  sellToken: SelectedPrivacy;
  sellTokenList: SelectedPrivacy[];

  buyToken: SelectedPrivacy;
  buyNetworkList: ITokenNetwork[] | undefined;
  buyCurrency: number;
  buyNetworkName: MAIN_NETWORK_NAME;
}

const getUnshieldData = ({
  unshield,
  getDataByTokenID,
  getDepositTokenData,
  state,
}: {
  unshield: IFormUnshieldReducer;
  getDataByTokenID: (tokenID: string) => SelectedPrivacy;
  getDepositTokenData: (tokenID: string) => SelectedPrivacy;
  state: AppState;
}): IUnshieldData => {
  const { sellToken, buyToken } = unshield;
  const { networkName: sellNetworkName, identify: sellIdentify, currency: sellCurrency } = sellToken;
  const { currency: buyCurrency, networkName: buyNetworkName } = buyToken;

  const formSelector = formValueSelector(FORM_CONFIGS.formName);
  const valid = isValid(FORM_CONFIGS.formName)(state);
  const submitting = isSubmitting(FORM_CONFIGS.formName)(state);

  const inputAmount = formSelector(state, FORM_CONFIGS.sellAmount);
  const inputAddress = formSelector(state, FORM_CONFIGS.toAddress);

  // sell token
  const _sellToken = getDataByTokenID(sellIdentify);
  const _sellTokenList = unshieldableTokens(state);

  // buy token
  const _buyToken = getDataByTokenID(_sellToken.parentTokenID);
  const _buyNetworkList = _buyToken.supportedNetwork;

  const isExternalAddress = !isPaymentAddress(inputAddress);

  // amount validator
  const inputOriginalAmount =
    convert.toOriginalAmount({
      decimals: _sellToken.pDecimals,
      humanAmount: inputAmount,
      round: false,
    }) || 0;

  const disabledForm = !valid || submitting || !isExternalAddress || new BigNumber(inputOriginalAmount).lte(0);

  return {
    unshieldAddress: inputAddress,
    sellToken: _sellToken,
    sellTokenList: _sellTokenList,

    buyToken: _buyToken,
    buyNetworkList: _buyNetworkList,
    buyCurrency,
    buyNetworkName,
  };
};

export { getUnshieldData };
