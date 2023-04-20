import React from "react";

const MiroEmbed = ({
  attrs,
}: {
  attrs: {
    href: string;
  };
}) => {
  console.log({ attrs });
  return (
    <div
      style={{ width: "100%", paddingBottom: "56.25%", position: "relative" }}
    >
      <iframe
        src={`${attrs?.href}/embed`}
        title="Miro Embed"
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

export default MiroEmbed;
