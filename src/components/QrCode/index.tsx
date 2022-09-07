import React from 'react';
import QRCodeReact from 'react-qr-code';
import styled from 'styled-components/macro';

interface IProps {
  hook?: any;
  qrCodeProps: any;
  label?: string;
  copyProps?: any;
}

const Styled = styled.div`
  .label {
    text-align: center;
    margin-left: 54px;
    margin-right: 54px;
  }
  .qrcode-react {
    justify-content: center;
    display: flex;
    width: fit-content;
    padding: 8px;
    margin: auto;
    background-color: ${({ theme }) => theme.primary5};
    border-radius: 8px;
  }
`;

const QrCode = (props: IProps) => {
  const { qrCodeProps, label } = props;
  return (
    <Styled>
      <div className="label">{label}</div>
      <div className="qrcode-react">
        <QRCodeReact {...{ ...qrCodeProps, size: qrCodeProps?.size || 184 }} bgColor="transparent" />
      </div>
    </Styled>
  );
};

export default QrCode;
