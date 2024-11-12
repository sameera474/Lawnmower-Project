export const formatData = (data) => {
  return {
    labels: data.map((item) => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Battery Level",
        data: data.map((item) => item.batteryLevel),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };
};
