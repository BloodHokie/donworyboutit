import { useModal } from 'components/Modal';
import LoadingTransaction from 'components/Modal/Modal.transaction';
import React from 'react';

import { TransactionSubmittedContent } from '../../../../components/Core/TransactionConfirmationModal';

export interface TInter {
  onSend: () => void;
}

const enhanceSend = (WrappedComponent: any) => {
  const FormDepositComp = (props: any) => {
    const {
      isApproved,
      checkIsApproved,
      handleApproveToken,
      handleDepositERC20,
      handleDepositEVM,
      sellToken,
      handleLoadBalance,
    } = props;

    const { setModal, clearAllModal } = useModal();

    const _handleDepositERC20 = async () => {
      try {
        if (!isApproved) {
          // Check Approve
          await handleApproveToken();
          await checkIsApproved();
        }
        // Handle deposit ERC20
        return await handleDepositERC20();
      } catch (error) {
        throw error;
      }
    };
    const _handleDepositEVM = async () => handleDepositEVM();

    const onSend = async () => {
      try {
        let tx;
        setModal({
          isTransparent: false,
          rightHeader: undefined,
          title: '',
          closable: true,
          data: <LoadingTransaction pendingText="Waiting For Confirmation" />,
        });
        if (sellToken.isMainEVMToken) {
          tx = await _handleDepositEVM();
        } else {
          tx = await _handleDepositERC20();
        }
        clearAllModal();
        if (handleLoadBalance) {
          handleLoadBalance();
        }
        if (tx.hash) {
          setModal({
            isTransparent: false,
            rightHeader: undefined,
            title: '',
            closable: true,
            data: <TransactionSubmittedContent chainId={sellToken.currencyType} hash={tx.hash} inline />,
          });
        }
      } catch (error) {
        clearAllModal();
        console.log('SEND WITH ERROR: ', error);
      }
    };
    return <WrappedComponent {...{ ...props, onSend }} />;
  };
  FormDepositComp.displayName = 'FormDeposit.enhanceDeposit';
  return FormDepositComp;
};

export default enhanceSend;
