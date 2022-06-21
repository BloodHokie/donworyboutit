import useCopyClipboard from '@hooks/useCopyClipboard';
import { LinkStyledButton } from '@src/components';
import React, { useCallback } from 'react';
import { CheckCircle, Copy } from 'react-feather';
import styled from 'styled-components/macro';

const CopyIcon = styled(LinkStyledButton)`
  color: ${({ color, theme }) => color || theme.content4};
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  :hover,
  :active,
  :focus {
    text-decoration: none;
  }
`;
const StyledText = styled.span`
  margin-left: 0.25rem;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
`;

const Copied = ({ iconSize }: { iconSize?: number }) => (
  <StyledText>
    <CheckCircle size={iconSize ?? '24'} />
    <StyledText>Copied</StyledText>
  </StyledText>
);

const Icon = ({ iconSize }: { iconSize?: number }) => (
  <StyledText>
    <Copy size={iconSize ?? '24'} />
  </StyledText>
);

interface BaseProps {
  toCopy: string;
  color?: string;
  iconSize?: number;
  iconPosition?: 'left' | 'right';
}
export type CopyHelperProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

const CopyHelper = ({
  color,
  toCopy,
  children,
  iconSize,
  iconPosition,
}: CopyHelperProps) => {
  const [isCopied, setCopied] = useCopyClipboard();
  const copy = useCallback(() => {
    setCopied(toCopy);
  }, [toCopy, setCopied]);

  return (
    <CopyIcon onClick={copy} color={color}>
      {iconPosition === 'left' ? (
        isCopied ? (
          <Copied iconSize={iconSize} />
        ) : (
          <Icon iconSize={iconSize} />
        )
      ) : null}
      {iconPosition === 'left' && <>&nbsp;</>}
      {isCopied ? '' : children}
      {iconPosition === 'right' && <>&nbsp;</>}
      {iconPosition === 'right' ? (
        isCopied ? (
          <Copied iconSize={iconSize} />
        ) : (
          <Icon iconSize={iconSize} />
        )
      ) : null}
    </CopyIcon>
  );
};

export default CopyHelper;
