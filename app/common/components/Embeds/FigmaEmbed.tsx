import React from "react";

const FigmaEmbed = ({
  attrs,
}: {
  attrs: {
    href: string;
  };
}) => {
  return (
    <div
      style={{ width: "100%", paddingBottom: "56.25%", position: "relative" }}
    >
      <iframe
        src={`https://www.figma.com/embed?embed_host=astra&url=${encodeURIComponent(
          attrs?.href
        )}`}
        title="Figma Embed"
        style={{
          border: 0,
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default FigmaEmbed;
