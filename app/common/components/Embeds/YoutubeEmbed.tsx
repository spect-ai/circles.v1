import styled from "styled-components";

export default function YouTubeEmbed({
  attrs,
}: {
  attrs: {
    href: string;
    matches: any;
  };
}) {
  const id =
    attrs?.href &&
    attrs.href.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
    )?.[2];

  if (id) {
    return (
      <StyledIframe
        src={`https://www.youtube.com/embed/${id}?rel=0&enablejsapi=1`}
        allowFullScreen
        title="YouTube Video"
      />
    );
  } else return null;
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
