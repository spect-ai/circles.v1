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

// export function formatTime(date: Date) {
//   let hours = date.getHours();
//   let minutes = date.getMinutes();
//   const ampm = hours >= 12 ? "pm" : "am";
//   hours %= 12;
//   hours = hours || 12; // the hour '0' should be '12'
//   minutes = `0${minutes}`.slice(-2);
//   const strTime = `${hours}:${minutes} ${ampm}`;
//   return strTime;
// }

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
  if (!date.getDate) {
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
