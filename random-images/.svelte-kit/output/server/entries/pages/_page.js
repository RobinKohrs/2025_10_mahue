import Papa from "papaparse";
async function getCsvData(fetch) {
  await new Promise((resolve) => setTimeout(resolve, 2e3));
  const response = await fetch(`/sample-data.csv`);
  const csvText = await response.text();
  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve(results.data);
      }
    });
  });
}
function load({ fetch }) {
  return {
    itemsPromise: getCsvData(fetch)
  };
}
export {
  load
};
