import React from "react";
import styled from "styled-components";

interface BlurDivProps {
  style?: React.CSSProperties;
  blurDegree: number;
  isBlur?: boolean;
  children: React.ReactNode;
}

const StyledBlurDiv = styled.div<{
  $blurDegree: number;
  $isBlur?: boolean;
}>`
  filter: blur(${(props) => props.$blurDegree}px);
  pointer-events: ${(props) => (props.$isBlur ? "none" : "auto")};
`;

const BlurDiv: React.FC<BlurDivProps> = ({
  style,
  blurDegree,
  isBlur,
  children,
}) => {
  return (
    <StyledBlurDiv style={style} $blurDegree={blurDegree} $isBlur={isBlur}>
      {children}
    </StyledBlurDiv>
  );
};

export default BlurDiv;
