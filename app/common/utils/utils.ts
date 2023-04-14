import { H } from "highlight.run";

/* eslint-disable @typescript-eslint/restrict-plus-operands */
export const reorder = (
  list: string[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function downloadCSV(content: Array<Array<any>>, filename: string) {
  const csvContent = `data:text/csv;charset=utf-8,${content
    .map((e) => e.join(","))
    .join("\n")}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link); // Required for FF

  link.click();
}

export function toIsoString(date: Date) {
  if (!date?.getDate) {
    return "";
  }
  const tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num: any) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
}

export const dateIsInvalid = (startDate: string, endDate: string) => {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start > end;
  }
  return false;
};

export function timeSince(date: Date) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

export const smartTrim = (string: string, maxLength: number) => {
  if (!string) {
    return "";
  }
  if (maxLength < 1) return string;
  if (string.length <= maxLength) return string;
  if (maxLength === 1) return `${string.substring(0, 1)}...`;

  const midpoint = Math.ceil(string.length / 2 + 0);
  const toremove = string.length - maxLength;
  const lstrip = Math.ceil(toremove / 2);
  const rstrip = toremove - lstrip;
  return `${string.substring(0, midpoint - lstrip)}...${string.substring(
    midpoint + rstrip
  )}`;
};

const getRgb = () => Math.floor(Math.random() * 256);

const rgbToHex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");

export const generateColorHEX = () => {
  const color = {
    r: getRgb(),
    g: getRgb(),
    b: getRgb(),
  };
  return rgbToHex(color.r, color.g, color.b);
};

export const isEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const isURL = (url: string) => {
  return String(url)
    .toLowerCase()
    .match(/((?:https?:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i);
};

export const convertToId = (text: string) => {
  // lowercase and replace spaces with underscores
  return text
    .toLowerCase()
    .replace(/ /g, "_")
    .replace(/[^\w-]+/g, "");
};

export const trackError = (error: string) => {
  process.env.NODE_ENV === "production" && H.consumeError(new Error(error));
};
