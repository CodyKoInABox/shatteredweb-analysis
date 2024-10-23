import { Application, Router } from "https://deno.land/x/oak@v17.1.0/mod.ts";
import { 
  AllSkinsIndex, 
  StMarcIndex, 
  CanalsIndex, 
  NorseIndex, 
  GrayIndex, 
  LightblueIndex, 
  BlueIndex, 
  PurpleIndex 
} from "../main.ts"; // Your aggregated skins data

const router = new Router();

// Function to calculate moving average for a given number of days
function calculateMovingAverage(data: number[], days: number): (number | null)[] {
  const movingAverages: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < days - 1) {
      movingAverages.push(null); // Not enough data for moving average
    } else {
      const sum = data.slice(i - days + 1, i + 1).reduce((a, b) => a + b, 0);
      movingAverages.push(sum / days);
    }
  }
  return movingAverages;
}

// Function to calculate linear regression
function linearRegression(data: number[], months: number): number[] {
  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = data;

  const xMean = x.reduce((sum, value) => sum + value, 0) / n;
  const yMean = y.reduce((sum, value) => sum + value, 0) / n;

  const numerator = x.reduce((sum, value, i) => sum + (value - xMean) * (y[i] - yMean), 0);
  const denominator = x.reduce((sum, value) => sum + (value - xMean) ** 2, 0);
  
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  // Calculate projected prices for the next `months` months
  return Array.from({ length: months }, (_, i) => intercept + slope * (n + i));
}

// Function to serve the HTML chart for a given index
async function serveChart(context: any, indexData: any[], indexName: string) {
  const prices = indexData.map(item => item.prices.reduce((a: any, b: any) => a + b, 0) / item.prices.length);
  const filteredPrices = prices.slice(0, -30); // Exclude last 30 days
  const labels = indexData.map(item => item.date).slice(0, -30); // Adjust labels accordingly

  // Calculate moving averages
  const movingAverage7Days = calculateMovingAverage(filteredPrices, 7);
  const movingAverage30Days = calculateMovingAverage(filteredPrices, 30);
  const movingAverage180Days = calculateMovingAverage(filteredPrices, 180);
  const movingAverage365Days = calculateMovingAverage(filteredPrices, 365);
  
  // Serve an HTML page that includes Chart.js and displays the data
  context.response.body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${indexName} Line Graph</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
        <canvas id="${indexName}Chart" width="400" height="200"></canvas>
        <script>
          const labels = ${JSON.stringify(labels)};
          const prices = ${JSON.stringify(filteredPrices)};
          const movingAverage7Days = ${JSON.stringify(movingAverage7Days)};
          const movingAverage30Days = ${JSON.stringify(movingAverage30Days)};
          const movingAverage180Days = ${JSON.stringify(movingAverage180Days)};
          const movingAverage365Days = ${JSON.stringify(movingAverage365Days)};

          const ctx = document.getElementById('${indexName}Chart').getContext('2d');
          const chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: '${indexName} Prices',
                  data: prices,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                  fill: false,
                  pointRadius: 0, // Disable the dots
                },
                {
                  label: '7-Day Moving Average',
                  data: movingAverage7Days,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                  fill: false,
                  pointRadius: 0, // Disable the dots
                },
                {
                  label: '30-Day Moving Average',
                  data: movingAverage30Days,
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 2,
                  fill: false,
                  pointRadius: 0, // Disable the dots
                },
                {
                  label: '180-Day Moving Average',
                  data: movingAverage180Days,
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 2,
                  fill: false,
                  pointRadius: 0, // Disable the dots
                },
                {
                  label: '365-Day Moving Average',
                  data: movingAverage365Days,
                  borderColor: 'rgba(153, 102, 255, 1)',
                  borderWidth: 2,
                  fill: false,
                  pointRadius: 0, // Disable the dots
                },
              ]
            },
            options: {
              scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Price' } }
              }
            }
          });
        </script>
    </body>
    </html>
  `;
}

// Function to serve projection for a given index
async function serveProjection(context: any, indexData: any[], indexName: string) {
  const prices = indexData.map(item => item.prices.reduce((a: any, b: any) => a + b, 0) / item.prices.length);
  const movingAverage = calculateMovingAverage(prices, 30); // Using 30 days moving average for projection
  const projection = linearRegression(prices, 12);
  
  // Generate past price labels and projection labels
  const pastLabels = prices.map((_, i) => `Day ${i + 1}`); // Generate labels for past prices
  const projectionLabels = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`); // Generate projection labels
  
  // Serve an HTML page that includes Chart.js and displays the projection
  context.response.body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${indexName} Projection</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
        <canvas id="${indexName}ProjectionChart" width="400" height="200"></canvas>
        <script>
          const pastPrices = ${JSON.stringify(prices)};
          const movingAverage = ${JSON.stringify(movingAverage)};
          const projection = ${JSON.stringify(projection)};
          const projectionLabels = ${JSON.stringify(projectionLabels)};
          
          // Create combined labels for the chart
          const labels = pastPrices.map((_, i) => \`Day \${i + 1}\`).concat(projectionLabels);
  
          const ctx = document.getElementById('${indexName}ProjectionChart').getContext('2d');
          const chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels, // Use the combined labels
              datasets: [
                {
                  label: '${indexName} Prices',
                  data: pastPrices,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                  fill: false,
                  pointRadius: 0, // Disable the dots
                },
                {
                  label: '30-Day Moving Average',
                  data: movingAverage,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                  fill: false,
                  pointRadius: 0, // Disable the dots
                },
                {
                  label: '12-Month Projection',
                  data: projection,
                  borderColor: 'rgba(255, 165, 0, 1)', // Orange for projection
                  borderWidth: 2,
                  fill: false,
                  pointRadius: 0, // Disable the dots
                },
              ]
            },
            options: {
              scales: {
                x: { title: { display: true, text: 'Time' } },
                y: { title: { display: true, text: 'Price' } }
              }
            }
          });
        </script>
    </body>
    </html>
  `;
}

// Define routes
const routes = [
  { path: "/all-skins", indexData: AllSkinsIndex, indexName: "AllSkins" },
  { path: "/purple", indexData: PurpleIndex, indexName: "PurpleIndex" },
  { path: "/blue", indexData: BlueIndex, indexName: "BlueIndex" },
  { path: "/lightblue", indexData: LightblueIndex, indexName: "LightblueIndex" },
  { path: "/gray", indexData: GrayIndex, indexName: "GrayIndex" },
  { path: "/norse", indexData: NorseIndex, indexName: "NorseIndex" },
  { path: "/canals", indexData: CanalsIndex, indexName: "CanalsIndex" },
  { path: "/st-marc", indexData: StMarcIndex, indexName: "StMarcIndex" },
];

// Register the routes
for (const { path, indexData, indexName } of routes) {
  router.get(path, async (context) => {
    await serveChart(context, indexData, indexName);
  });
  router.get(`${path}/projection`, async (context) => {
    await serveProjection(context, indexData, indexName);
  });
}

// Create the Oak application and register the router
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const PORT = 8000;
console.log(`Server is running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
