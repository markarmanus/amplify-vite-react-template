import styled from "styled-components";
import { DownOutlined } from "@ant-design/icons";
import React, { ReactNode, useState, useRef } from "react";

const DividerDiv = styled.div<{
  color: string;
  fontSize: number;
  openable: boolean;
}>`
  display: flex;
  padding: 10px;
  align-items: center;
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  cursor: ${(props) => (props.openable ? "pointer" : "auto")};
`;

const TitleDiv = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  text-transform: uppercase;
`;

const DividerLine = styled.hr<{ color: string }>`
  width: -webkit-fill-available;
  margin: 5px;
  color: ${(props) => props.color};
`;

const ArrowIcon = styled(DownOutlined)<{
  showing: boolean;
  fontSize: number;
  color: string;
}>`
  padding: 0px 10px;
  font-size: calc(${(props) => props.fontSize}px * (2 / 3));
  color: ${(props) => props.color};
  transition: all 0.5s ease;
  transform: ${(props) => (!props.showing ? "rotate(-90deg)" : "rotate(0)")};
`;

const ExpandingDiv = styled.div<{ $show: boolean; height?: number }>`
  opacity: ${(props) => (props.$show ? 1 : 0)};
  max-height: ${(props) =>
    props.$show ? (props.height ? props.height + "px" : "unset") : 0};
  overflow: hidden;
  left: 0;
  transition: all 0.5s ease;
`;

interface ExpandingDividerProps {
  color: string;
  titleColor: string;
  lineColor: string;
  fontSize: number;
  openable: boolean;
  title: string;
  children: ReactNode;
}

const ExpandingDivider: React.FC<ExpandingDividerProps> = ({
  color,
  titleColor,
  lineColor,
  fontSize,
  openable,
  title,
  children,
}) => {
  const [showContent, setShowContent] = useState<boolean>(false);
  const expandingDivRef = useRef<HTMLDivElement | null>(null);

  const toggleShowContent = (show?: boolean) => {
    setShowContent((prev) => (show !== undefined ? show : !prev));
  };

  const getContentHeight = () => {
    return expandingDivRef.current?.scrollHeight;
  };

  return (
    <div>
      <DividerDiv
        color={color}
        fontSize={fontSize}
        openable={openable}
        onClick={() => {
          if (openable) toggleShowContent();
        }}
      >
        <TitleDiv color={titleColor}>{title}</TitleDiv>
        {openable && (
          <ArrowIcon
            showing={showContent}
            fontSize={fontSize}
            color={titleColor}
          />
        )}
        <DividerLine color={lineColor} />
      </DividerDiv>
      <ExpandingDiv
        ref={expandingDivRef}
        height={getContentHeight()}
        $show={showContent}
      >
        {children}
        <DividerLine color={lineColor} style={{ margin: "0px 15px" }} />
      </ExpandingDiv>
    </div>
  );
};

export default ExpandingDivider;
