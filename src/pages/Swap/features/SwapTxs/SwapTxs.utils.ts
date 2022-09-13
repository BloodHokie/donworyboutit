import isEmpty from 'lodash/isEmpty';
import { ISwapTxStorage } from 'pages/Swap/Swap.storage';

import format from '../../../../utils/format';

enum ExchangeStatus {
  reverted = 'reverted',
  success = 'success',
  failed = 'failed',
  pending = 'pending',
  unvailable = 'unvailable',
}

enum TxStatus {
  submitting = 'submitting',
  submit_failed = 'submit_failed',
  pending = 'pending',
  executing = 'executing',
  rejected = 'rejected',
  accepted = 'accepted',
}

enum Status {
  success = 'success',
  processing = 'processing',
  fail = 'fail',
  reverted = 'reverted',
}

export interface ISwapTxStatus {
  requestBurnTxInc: string;
  burnTxStatus: TxStatus;

  outchainTx: string;
  outchainTxStatus: string;

  swapExchangeStatus: ExchangeStatus;

  isRedeposit: boolean;
  redepositTxInc: string;
  redepositStatus: TxStatus;

  status: Status;
  color: string;
  time: string;
}

const combineSwapTxs = ({ localTxs, swapTxs }: { localTxs: ISwapTxStorage[]; swapTxs: any }) => {
  // @ts-ignore
  const txs: ISwapTxStatus[] = localTxs.reduce((prev, curr) => {
    const apiResp: any = swapTxs[curr.txHash];
    if (!apiResp || isEmpty(apiResp)) return prev;
    let tx: any = {
      requestBurnTxInc: curr.txHash,
      burnTxStatus: apiResp.inc_request_tx_status,
      time: format.formatDateTime({ dateTime: curr.time || new Date().getTime() }),
    };

    if (apiResp.network_result && !isEmpty(apiResp.network_result)) {
      const networkStatus = apiResp.network_result[0];
      tx = {
        ...tx,
        outchainTx: networkStatus.swap_tx,
        outchainTxStatus: networkStatus.swap_tx_status,

        swapExchangeStatus: networkStatus.swap_outcome,

        isRedeposit: networkStatus.is_redeposit,
        redepositTxInc: networkStatus.redeposit_inctx,
        redepositStatus: networkStatus.redeposit_status,
      };
    }

    // inc_request_tx_status
    // -> bsc_swap_tx_status
    // -> bsc_swap_outcome
    // -> is_redeposit === true bsc_redeposit_status
    /** to many cases, please blame @lam */
    let swapStatus = Status.processing;
    const { burnTxStatus, outchainTxStatus, swapExchangeStatus, isRedeposit, redepositStatus } = tx;
    switch (burnTxStatus) {
      case TxStatus.pending:
      case TxStatus.submitting:
      case TxStatus.executing:
        swapStatus = Status.processing; // processing
        break;
      case TxStatus.submit_failed:
      case TxStatus.rejected:
        swapStatus = Status.fail;
        break;
      case TxStatus.accepted: // <---
        switch (outchainTxStatus) {
          case TxStatus.pending:
          case TxStatus.submitting:
          case TxStatus.executing:
            break; // processing
          case TxStatus.submit_failed:
          case TxStatus.rejected:
            swapStatus = Status.fail; // fail
            break;
          case TxStatus.accepted: // <---
            switch (swapExchangeStatus) {
              case ExchangeStatus.pending:
                break; // processing
              case ExchangeStatus.failed:
              case ExchangeStatus.unvailable:
                swapStatus = Status.fail; // fail
                break;
              case ExchangeStatus.success:
              case ExchangeStatus.reverted: // <---
                if (isRedeposit) {
                  switch (redepositStatus) {
                    case TxStatus.pending:
                    case TxStatus.submitting:
                    case TxStatus.executing:
                      break; // processing
                    case TxStatus.submit_failed:
                      swapStatus = Status.fail; // fail
                      break;
                    case TxStatus.accepted:
                      swapStatus = swapExchangeStatus === ExchangeStatus.success ? Status.success : Status.reverted;
                      break;
                  }
                } else {
                  swapStatus = Status.success;
                }
                break;
              default:
                swapStatus = Status.processing;
                break;
            }
            break;
          default:
            swapStatus = Status.processing;
            break;
        }
        break;
      default:
        swapStatus = Status.processing;
        break;
    }
    let color = '#FFC043';
    switch (swapStatus) {
      case Status.fail:
        color = '#F6465D';
        break;
      case Status.processing:
      case Status.reverted:
        color = '#FFC043';
        break;
      case Status.success:
        color = '#34C759';
        break;
    }
    const data: ISwapTxStatus = {
      ...tx,
      status: swapStatus,
      color,
    };
    return [...prev, data];
  }, []);
  return txs;
};

export { combineSwapTxs };
