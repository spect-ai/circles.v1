import React, { useRef } from "react";
import { Box } from "degen";
import styled from "styled-components";

const ResizableIframe = ({
  src,
  title,
  onResize,
}: {
  src: string;
  title: string;
  onResize: (height: number, width: number) => void;
}) => {
  const iframeRef = useRef(null);
  const overlayRef = useRef(null);

  const onMouseDown = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    direction: string
  ) => {
    e.preventDefault();
    const iframe = iframeRef.current as any;
    const overlay = overlayRef.current as any;
    const originalWidth = iframe.getBoundingClientRect().width;
    const originalHeight = iframe.getBoundingClientRect().height;
    const originalMouseX = e.clientX;
    const originalMouseY = e.clientY;
    overlay.style.display = "block";

    const onMouseMove = (moveEvent: { clientX: number; clientY: number }) => {
      let newWidth, newHeight, paddingLeft;

      if (direction === "horizontalRight") {
        const deltaX = moveEvent.clientX - originalMouseX;
        newWidth = originalWidth + deltaX;
      } else if (direction === "horizontalLeft") {
        paddingLeft = moveEvent.clientX - originalMouseX;
      } else {
        const deltaY = moveEvent.clientY - originalMouseY;
        newHeight = originalHeight + deltaY;
      }

      if (newWidth < 200) newWidth = 200;
      iframe.style.width = `${newWidth}px`;

      if (newHeight < 200) newHeight = 200;
      iframe.style.height = `${newHeight}px`;

      if (paddingLeft) {
        iframe.style.paddingLeft = `${paddingLeft}px`;
      }
    };

    const onMouseUp = () => {
      overlay.style.display = "none";

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      onResize(
        iframe.getBoundingClientRect().height,
        iframe.getBoundingClientRect().width
      );
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <IframeContainer>
      <Box display="flex" flexDirection="row" alignItems="center">
        {" "}
        <ResizerHorizontal
          onMouseDown={(e) => onMouseDown(e, "horizontalLeft")}
        />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Iframe src={src} title={title} ref={iframeRef} />
          <ResizerVertical onMouseDown={(e) => onMouseDown(e, "vertical")} />
        </Box>
        <ResizerHorizontal
          onMouseDown={(e) => onMouseDown(e, "horizontalRight")}
        />
      </Box>
      <Overlay ref={overlayRef} />
    </IframeContainer>
  );
};

export default ResizableIframe;

const IframeContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  display: inline-block;
`;

const ResizerVertical = styled(Box)`
  bottom: 0;
  right: 0;
  width: 3.5rem;
  height: 0.5rem;
  background: #fff;
  border: 1px solid #000;
  border-radius: 5px;
  cursor: ns-resize;
`;

const ResizerHorizontal = styled(Box)`
  bottom: 0;
  right: 0;
  width: 0.5rem;
  height: 3.5rem;
  background: #fff;
  border: 1px solid #000;
  border-radius: 5px;
  cursor: ew-resize;
`;

const Iframe = styled.iframe`
  border: 0;
`;

const Overlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  z-index: 10;
`;
