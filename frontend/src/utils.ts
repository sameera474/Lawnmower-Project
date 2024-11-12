// utils.ts

// Helper function to set datasets for chart data
export function setDatasets(data) {
  if (!Array.isArray(data)) {
    console.warn("Data is not an array or is undefined:", data);
    return [];
  }

  return data.map((item) => ({
    label: item.label || "Default Label",
    data: item.data || [],
    backgroundColor: item.backgroundColor || "rgba(75,192,192,0.4)",
    borderColor: item.borderColor || "rgba(75,192,192,1)",
  }));
}

// Helper function to clone data
export function cloneData(data) {
  if (!Array.isArray(data)) {
    console.warn("cloneData received non-array data:", data);
    return [];
  }

  return data.map((item) => ({ ...item }));
}
