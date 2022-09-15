import { getIncognitoInject, useIncognitoWallet } from 'components/Core/IncognitoWallet/IncongitoWallet.useContext';
import { TransactionSubmittedContent } from 'components/Core/TransactionConfirmationModal';
import { useModal } from 'components/Modal';
import LoadingTransaction from 'components/Modal/Modal.transaction';
import { MAIN_NETWORK_NAME, PRIVATE_TOKEN_CURRENCY_TYPE } from 'constants/token';
import { FORM_CONFIGS } from 'pages/Swap/Swap.constant';
import { setSwapTx } from 'pages/Swap/Swap.storage';
import { batch } from 'react-redux';
import { change, focus, untouch } from 'redux-form';
import { rpcClient } from 'services';
import rpcMetric, { METRIC_TYPE } from 'services/rpcMetric';
import { useAppDispatch } from 'state/hooks';

import { actionEstimateFee } from './FormUnshield.actions';
import { IMergeProps } from './FormUnshield.enhance';
import { FormTypes, NetworkTypePayload } from './FormUnshield.types';
import { getBurningMetaDataTypeForUnshield, getPrvPayments, getTokenPayments } from './FormUnshield.utils';
export interface TInner {
  onSend: () => void;
}

const enhanceSend = (WrappedComponent: any) => {
  const FormUnshieldComp = (props: IMergeProps) => {
    const {
      disabledForm,
      buyToken,
      sellToken,
      fee,
      burnOriginalAmount,
      inputAddress,
      inputAmount,
      unshieldAddress,
      formType,
      exchangeSelected,
      swapFee,
      exchangeSelectedData,
      estimateTradeErrorMsg,
      web3Account,
      buyNetworkName,
      swapNetwork,
      buyParentToken,
      isFetching,
      incAddress,
      isUseTokenFee,
    } = props;
    const dispatch = useAppDispatch();
    const { requestSignTransaction, isIncognitoInstalled, requestIncognitoAccount } = useIncognitoWallet();
    const { setModal, clearAllModal } = useModal();
    const updateMetric = () => rpcMetric.updateMetric({ type: METRIC_TYPE.CONFIRM_SWAP });

    const handleUnshieldToken = async () => {
      const {
        feeAddress,
        networkFee,
        networkFeeToken,
        burnFee,
        burnFeeToken,
        id,
        estimatedBurnAmount,
        estimatedExpectedAmount,
        useFast2xFee,
      } = fee;
      if (
        formType === FormTypes.UNSHIELD &&
        sellToken.isUnified &&
        (!estimatedBurnAmount || !estimatedExpectedAmount)
      ) {
        return;
      }
      if (formType === FormTypes.SWAP && (estimateTradeErrorMsg || isFetching)) return;
      try {
        // Get remote address
        let remoteAddress: string = inputAddress || '';
        if (remoteAddress.startsWith('0x')) {
          remoteAddress = remoteAddress.slice(2);
        }

        // Get payment info
        let prvPayments: any[] = [];
        let tokenPayments: any[] = [];
        if (isUseTokenFee) {
          tokenPayments = await getTokenPayments(
            [
              {
                paymentAddress: formType === FormTypes.SWAP ? exchangeSelectedData?.feeAddress : feeAddress,
                amount: formType === FormTypes.SWAP ? swapFee?.amount : parseInt(burnFee || '0'),
              },
            ],
            parseInt(burnOriginalAmount)
          );
        } else {
          prvPayments = await getPrvPayments([
            {
              paymentAddress: formType === FormTypes.SWAP ? exchangeSelectedData?.feeAddress : feeAddress,
              amount: formType === FormTypes.SWAP ? swapFee?.amount : parseInt(burnFee || '0'),
            },
          ]);
          tokenPayments = await getTokenPayments([], parseInt(burnOriginalAmount));
        }

        const burningMetaDataType: number = getBurningMetaDataTypeForUnshield(sellToken);

        const incognito = getIncognitoInject();

        // Get OTA Receiver
        const { result }: { result: any } = await incognito.request({
          method: 'wallet_requestAccounts',
          params: {},
        });
        const otaReceiver = result?.otaReceiver;

        let payload: any;
        if (formType === FormTypes.UNSHIELD) {
          // Payload data for unshield
          payload = {
            networkFee,
            prvPayments,
            tokenPayments,
            info: String(id),
            tokenID: sellToken?.tokenID,
            metadata: {
              Type: burningMetaDataType,
              UnifiedTokenID: sellToken?.isUnified ? sellToken?.tokenID : null,
              Data: [
                {
                  IncTokenID: buyToken.tokenID,
                  BurningAmount: burnOriginalAmount,
                  RemoteAddress: remoteAddress,
                  MinExpectedAmount: burnOriginalAmount,
                },
              ],
              Receiver: otaReceiver,
              IsDepositToSC: false,
            },
            txType: 7,
            receiverAddress: remoteAddress,
            isSignAndSendTransaction: true,
          };
        } else {
          // Get swap payload data
          let externalCallData: string = exchangeSelectedData?.callData;
          let externalCallAddress: string = exchangeSelectedData?.callContract;

          if (externalCallData.startsWith('0x')) {
            externalCallData = externalCallData.slice(2);
          }

          if (externalCallAddress.startsWith('0x')) {
            externalCallAddress = externalCallAddress.slice(2);
          }

          let buyTokenContract: string = exchangeSelectedData?.receiveTokenContractID;
          if (buyParentToken?.isUnified && formType === FormTypes.SWAP) {
            const childBuyToken = buyParentToken?.listUnifiedToken?.find(
              (token: any) => token?.networkID === exchangeSelectedData?.networkID
            );
            buyTokenContract = childBuyToken?.contractIDSwap;
          }

          if (buyTokenContract.startsWith('0x')) {
            buyTokenContract = buyTokenContract.slice(2);
          }

          const withdrawAddress: string =
            buyNetworkName === MAIN_NETWORK_NAME.INCOGNITO ? '0000000000000000000000000000000000000000' : remoteAddress;

          // Payload data for swap
          payload = {
            networkFee,
            prvPayments,
            tokenPayments,
            info: '',
            tokenID: sellToken?.tokenID,
            txType: 7,
            receiverAddress: remoteAddress,
            isSignAndSendTransaction: true,
            metadata: {
              Data: [
                {
                  IncTokenID: exchangeSelectedData?.incTokenID,
                  RedepositReceiver: otaReceiver,
                  BurningAmount: burnOriginalAmount,
                  ExternalNetworkID: exchangeSelectedData?.networkID,
                  ExternalCalldata: externalCallData,
                  ExternalCallAddress: externalCallAddress,
                  ReceiveToken: buyTokenContract,
                  WithdrawAddress: withdrawAddress,
                },
              ],
              BurnTokenID: sellToken?.tokenID,
              Type: 348,
            },
          };
        }

        return new Promise(async (resolve, reject) => {
          try {
            const tx = await requestSignTransaction(payload);
            // Submit tx swap to backend after burned;
            if (formType === FormTypes.SWAP) {
              const submitTxResult: any = await rpcClient.submitSwapTx({
                txHash: tx.txHash,
                txRaw: tx.rawData,
              });
              setSwapTx({
                txHash: tx.txHash,
                incAddress,
                time: new Date().getTime(),
              });
              console.log({ submitTxResult });
            } else {
              let networkName: NetworkTypePayload = NetworkTypePayload.ETHEREUM;
              if (exchangeSelectedData?.networkID === 1) {
                networkName = NetworkTypePayload.ETHEREUM;
              } else if (exchangeSelectedData?.networkID === 2) {
                networkName = NetworkTypePayload.BINANCE_SMART_CHAIN;
              } else if (exchangeSelectedData?.networkID === 3) {
                networkName = NetworkTypePayload.POLYGON;
              } else if (exchangeSelectedData?.networkID === 4) {
                networkName = NetworkTypePayload.FANTOM;
              }
              // Submit tx unshield to backend after burn
              const submitTxUnshieldResponse = await rpcClient.submitUnshieldTx2({
                network: networkName,
                userFeeLevel: useFast2xFee ? 2 : 1,
                id: id || 0,
                incognitoAmount: String(burnOriginalAmount),
                incognitoTx: tx.txHash,
                paymentAddress: inputAddress,
                privacyTokenAddress: buyToken.tokenID,
                userFeeSelection: isUseTokenFee ? 1 : 2,
                walletAddress: incAddress,
              });
              console.log({ submitTxUnshieldResponse });
            }
            updateMetric().then();
            resolve(tx);
          } catch (e) {
            reject(e);
          }
        });
      } catch (e) {
        console.log('HANDLE UNSHIELD WITH ERROR ', e);
      }
    };

    const onSend = async () => {
      if (disabledForm) {
        return batch(() => {
          dispatch(focus(FORM_CONFIGS.formName, FORM_CONFIGS.formAddress));
          dispatch(focus(FORM_CONFIGS.formName, FORM_CONFIGS.sellAmount));
        });
      }
      if (!isIncognitoInstalled()) {
        return requestIncognitoAccount();
      }

      setModal({
        isTransparent: false,
        rightHeader: undefined,
        title: '',
        closable: true,
        data: <LoadingTransaction pendingText="Waiting For Confirmation" />,
      });
      try {
        const resolve: any = await handleUnshieldToken();
        if (!resolve && !resolve?.txHash) return;
        clearAllModal();
        dispatch(change(FORM_CONFIGS.formName, FORM_CONFIGS.sellAmount, ''));
        dispatch(untouch(FORM_CONFIGS.formName, FORM_CONFIGS.sellAmount));
        setModal({
          isTransparent: false,
          rightHeader: undefined,
          title: '',
          closable: true,
          data: <TransactionSubmittedContent chainId={PRIVATE_TOKEN_CURRENCY_TYPE.INCOGNITO} hash={resolve.txHash} />,
        });
      } catch (e) {
        clearAllModal();
      } finally {
        if (formType === FormTypes.UNSHIELD) {
          setTimeout(() => {
            dispatch(actionEstimateFee());
          }, 300);
        }
      }
    };
    return <WrappedComponent {...{ ...props, onSend }} />;
  };
  FormUnshieldComp.displayName = 'FormUnshield.enhanceSend';
  return FormUnshieldComp;
};

export default enhanceSend;
