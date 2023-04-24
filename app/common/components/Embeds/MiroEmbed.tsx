import React from "react";
import styled from "styled-components";

const MiroEmbed = ({
  attrs,
}: {
  attrs: {
    href: string;
  };
}) => {
  return (
    <div style={{ width: "100%", position: "relative" }}>
      <StyledIframe
        src={`${attrs?.href}/embed`}
        title="Miro Embed"
        allowFullScreen
      ></StyledIframe>
    </div>
  );
};

export default MiroEmbed;

const StyledIframe = styled.iframe`
  @media (max-width: 768px) {
    width: 100%;
    height: 100%px;
  }
  @media (max-width: 1280px) and (min-width: 768px) {
    width: 100%;
    height: 250px;
  }
  width: 560px;
  height: 315px;
  border: 0;
  border-radius: 8px;
`;
