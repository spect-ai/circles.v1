import { Box } from "degen";
import React from "react";
import styled from "styled-components";

const SoulboundContainer = styled(Box)`
  height: 400px;
  width: 300px;
  background-image: url("/SpectNFTCard.svg");
  background-size: auto;
  border-radius: 4px;
  margin: 1rem;
  &:hover {
    cursor: pointer;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  }
  transition: all 0.5s ease;
`;

const SoulboundContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export type Props = {
  content: string;
  issuedBy: string;
  issuedOn: string;
  issuerAvatar: string;
};

export default function SoulboundToken({
  content,
  issuedBy,
  issuedOn,
  issuerAvatar,
}: Props) {
  return (
    <SoulboundContainer>
      <SoulboundContent>
        {/* SVG Code */}
        <svg height="384px" width="300px">
          <image
            height="384px"
            width="300px"
            xlinkHref="/SpectNFTCard.svg"
            preserveAspectRatio="xMinYMin slice"
          />

          <text
            fill="white"
            fontFamily="Poppins"
            fontWeight="bold"
            x="150px"
            textAnchor="middle"
            fontSize="20"
          >
            <tspan y="90" x="150px" textAnchor="middle">
              {content.split(" ").slice(0, 3).join(" ")}
            </tspan>
            <tspan y="120" x="150px" textAnchor="middle">
              {content.split(" ").slice(3, 6).join(" ")}
            </tspan>
            <tspan y="150" x="150px" textAnchor="middle">
              {content.split(" ").length > 8
                ? content.split(" ").slice(6, 8).join(" ") + " .."
                : content.split(" ").slice(6, 8).join(" ")}
            </tspan>
          </text>
          <text
            x="150px"
            y="220"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontFamily="Poppins"
          >
            Issued By
          </text>
          <rect
            x="60"
            y="240"
            height="45px"
            width="175px"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
            rx="25"
            ry="25"
            fill="rgba(255, 255, 255, 0.1)"
          />
          <image
            x={`${
              120 -
              (issuedBy.length > 9 ? issuedBy.substring(0, 9) : issuedBy)
                .length *
                5
            }`}
            y="250"
            height="25px"
            xlinkHref={`${issuerAvatar}`}
          />
          <text
            x={`${
              160 -
              (issuedBy.length > 9 ? issuedBy.substring(0, 9) : issuedBy)
                .length *
                5
            }`}
            y="268"
            textAnchor="start"
            fill="white"
            fontSize="18"
            fontFamily="Poppins"
          >
            {issuedBy}
          </text>
          <text
            x="50%"
            y="87%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontFamily="Poppins"
          >
            On
          </text>
          <text
            x="150px"
            textAnchor="middle"
            y="40"
            fill="rgba(255, 255, 255, 0.80)"
            fontSize="12"
            fontFamily="Poppins"
          >
            {issuedOn}
          </text>
          <image x="90" y="90%" height="40px" xlinkHref="/logoSBT.svg" />
        </svg>
      </SoulboundContent>
    </SoulboundContainer>
  );
}
