import { ExportToCsv } from "export-to-csv";

export const exportToCsv = (data: any[], filename: string) => {
  const options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: true,
    title: filename,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };
  console.log({ options });
  const csvExporter = new ExportToCsv(options);
  csvExporter.generateCsv(data);
};

const exportTableToCsv = (filename: string, rows: Array<Array<any>>) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach(function (rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
};
