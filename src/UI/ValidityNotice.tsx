import React from "react";
import styled from "styled-components";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

interface ValidationNoticeProps {
  isValid: boolean;
  noticeMessage: string;
}

const StyledNotice = styled.div<{ $isValid: boolean }>`
  color: ${(props) => (props.$isValid ? "green" : "#EA3737")};
  font-size: 12px;
`;

const ValidationNotice: React.FC<ValidationNoticeProps> = ({
  isValid,
  noticeMessage,
}) => {
  return (
    <StyledNotice $isValid={isValid}>
      {isValid ? (
        <CheckOutlined style={{ marginRight: "4px" }} />
      ) : (
        <CloseOutlined style={{ marginRight: "4px" }} />
      )}
      {noticeMessage}
    </StyledNotice>
  );
};

export default ValidationNotice;
