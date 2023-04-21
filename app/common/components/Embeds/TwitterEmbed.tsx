import { useEffect, useRef } from "react";

export default function TweetEmbed({
  attrs,
}: {
  attrs: {
    href: string;
    matches: any;
  };
}) {
  if (!attrs?.href) return null;
  const tweetId = attrs?.href.split("/").pop();
  const tweetRef = useRef(null);

  useEffect(() => {
    if ((window as any).twttr && (window as any).twttr.widgets) {
      (window as any).twttr.widgets
        .createTweet(tweetId, tweetRef.current, {
          conversation: "none",
          dnt: true,
        })
        .catch((error: any) => {
          console.error("Failed to render tweet:", error);
        });
    }

    return () => {
      if (tweetRef.current) {
        (tweetRef.current as any).innerHTML = "";
      }
    };
  }, [tweetId]);

  return (
    <div
      ref={tweetRef}
      className="twitter-tweet"
      data-conversation="none"
      data-dnt="true"
    >
      <a href={attrs?.href}></a>
    </div>
  );
}
