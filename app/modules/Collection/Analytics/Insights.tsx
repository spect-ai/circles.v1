import { useEffect, useState } from "react";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import { Box } from "degen";

type Props = {};

export const Insights = (props: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [responseMetrics, setResponseMetrics] = useState({} as any);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(
          `${process.env.API_HOST}/collection/v1/${collection?.id}/responseMetrics`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);
        setResponseMetrics(data);
        console.log({ data });
      } catch (err) {
        console.log({ err });
      }
    })();
  }, []);

  return <Box></Box>;
};
