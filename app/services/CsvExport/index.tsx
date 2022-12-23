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
