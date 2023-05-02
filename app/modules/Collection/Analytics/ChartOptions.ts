import { Context } from "chartjs-plugin-datalabels";

export const BarOptions = {
  indexAxis: "y" as "y",
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      formatter: (value: number, ctx: Context) => {
        let sum = 0;
        let dataArr = ctx.chart.data.datasets[0].data;
        dataArr.map((data) => {
          if (typeof data === "string") {
            sum += parseFloat(data);
          }
        });
        let percentage = ((value * 100) / sum).toFixed(2) + "%";
        return percentage;
      },
      color: "#fff",
    },
  },
  responsive: true,
  // maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        color: "rgb(191,90,242,0.8)",
      },
    },
    x: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: "rgb(191,90,242,0.8)",
      },
    },
  },
};

export const LineOptions = {
  indexAxis: "y" as "y",
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      formatter: (value: number, ctx: Context) => {
        let sum = 0;
        let dataArr = ctx.chart.data.datasets[0].data;
        dataArr.map((data) => {
          if (typeof data === "string") {
            sum += parseFloat(data);
          }
        });
        let percentage = ((value * 100) / sum).toFixed(1) + "%";
        return percentage;
      },
      color: "#fff",
    },
  },
  responsive: true,
  // maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        color: "rgb(191,90,242,0.8)",
      },
    },
    x: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: "rgb(191,90,242,0.8)",
      },
    },
  },
};

export const PieOptions = {
  indexAxis: "y" as "y",
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      formatter: (value: number, ctx: Context) => {
        let sum = 0;
        let dataArr = ctx.chart.data.datasets[0].data;
        const label = ctx.chart.data.labels?.[ctx.dataIndex];
        dataArr.map((data) => {
          if (typeof data === "string") {
            sum += parseFloat(data);
          }
        });
        let percentage = ((value * 100) / sum).toFixed(2) + "%";
        // return label + " " + percentage;
        return `${percentage}\n${label}`;
      },
      color: "#fff",
    },
  },
  responsive: true,
  // maintainAspectRatio: false,
  scales: {
    y: {
      display: false,
    },
    x: {
      display: false,
    },
  },
};
