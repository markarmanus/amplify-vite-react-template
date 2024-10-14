import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

const StyledModal = styled.div<{ $modalOpacity: number }>`
  position: fixed;
  z-index: 3;
  background-color: #202020;
  width: auto;
  padding: 16px;
  margin: 0 auto;
  box-sizing: border-box;
  display: block;
  left: 50%;
  top: 50%;
  transform: translate(calc(-50% - 0.5px), calc(-50%));

  opacity: ${(props) => props.$modalOpacity};
`;

interface ModalProps {
  closable?: boolean;
  closeModal?: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  closable = true,
  closeModal,
  children,
}) => {
  const [modalOpacity, setModalOpacity] = useState(0);

  useEffect(() => {
    const fadeInInterval = setInterval(() => {
      setModalOpacity((prevOpacity) => {
        const newOpacity = prevOpacity + 0.05;
        if (newOpacity >= 1) {
          clearInterval(fadeInInterval);
          return 1;
        }
        return newOpacity;
      });
    }, 5);

    return () => clearInterval(fadeInInterval); // Cleanup on unmount
  }, []);

  const modalFadeOut = () => {
    const closingInterval = setInterval(() => {
      setModalOpacity((prevOpacity) => {
        const newOpacity = prevOpacity - 0.05;
        if (newOpacity <= 0) {
          clearInterval(closingInterval);
          if (closeModal) closeModal();
          return 0;
        }
        return newOpacity;
      });
    }, 5);
  };

  return (
    <StyledModal $modalOpacity={modalOpacity}>
      {closable && (
        <CloseOutlined
          style={{
            color: "#404040",
            fontSize: "18px",
            margin: "8px",
            position: "absolute",
            left: "95%",
            top: "1%",
          }}
          onClick={modalFadeOut}
        />
      )}
      {children}
    </StyledModal>
  );
};

export default Modal;
