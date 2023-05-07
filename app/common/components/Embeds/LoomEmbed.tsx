import styled from "@emotion/styled";

export default function LoomEmbed({
  attrs,
}: {
  attrs: {
    href: string;
    matches: any;
  };
}) {
  const videoId = attrs?.href.match(/(?:share\/)([^/]+)/)?.[1];

  if (videoId) {
    return (
      <StyledIframe
        src={`https://www.loom.com/embed/${videoId}`}
        allowFullScreen
        title="Loom Video"
      />
    );
  }
  return null;
}
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
