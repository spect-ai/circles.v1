import { ExportToCsv } from "export-to-csv";

const exportToCsv = (data: unknown[], filename: string) => {
  const options = {
    fieldSeparator: ",",
    // eslint-disable-next-line @typescript-eslint/quotes
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: true,
    title: filename,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };
  const csvExporter = new ExportToCsv(options);
  csvExporter.generateCsv(data);
};

export default exportToCsv;
