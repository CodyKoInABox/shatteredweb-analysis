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
  const movingAverages = [];
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
  const projection = Array.from({ length: months }, (_, i) => intercept + slope * (n + i));
  return projection;
}

// Function to remove outliers using Z-score
function removeOutliers(data: number[], threshold: number = 3): number[] {
  const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
  const stdDev = Math.sqrt(data.reduce((sum, value) => sum + (value - mean) ** 2, 0) / data.length);
  
  return data.filter(value => Math.abs((value - mean) / stdDev) <= threshold);
}

// Function to serve the HTML chart for a given index
async function serveChart(context: any, indexData: any[], indexName: string) {
  const prices = indexData.map(item => item.prices.reduce((a: any, b: any) => a + b, 0) / item.prices.length);
  const filteredPrices = prices.slice(0, -30); // Exclude last 30 days
  const labels = indexData.map(item => item.date).slice(0, -30); // Adjust labels accordingly

  // Remove outliers from the filtered prices
  const cleanedPrices = removeOutliers(filteredPrices);
  
  // Calculate moving averages
  const movingAverage7Days = calculateMovingAverage(cleanedPrices, 7);
  const movingAverage30Days = calculateMovingAverage(cleanedPrices, 30);
  const movingAverage180Days = calculateMovingAverage(cleanedPrices, 180);
  const movingAverage365Days = calculateMovingAverage(cleanedPrices, 365);
  
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
          const data = ${JSON.stringify(indexData)};
          const labels = ${JSON.stringify(labels)};
          const prices = ${JSON.stringify(cleanedPrices)};
          const movingAverage7Days = ${JSON.stringify(movingAverage7Days)};
          const movingAverage30Days = ${JSON.stringify(movingAverage30Days)};
          const movingAverage180Days = ${JSON.stringify(movingAverage180Days)};
          const movingAverage365Days = ${JSON.stringify(movingAverage365Days)};

          const ctx = document.getElementById('${indexName}Chart').getContext('2d');
          const chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: '${indexName} Prices',
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
                pointRadius: 0, // Disable the dots
              }, {
                label: '7-Day Moving Average',
                data: movingAverage7Days,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0, // Disable the dots
              }, {
                label: '30-Day Moving Average',
                data: movingAverage30Days,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0, // Disable the dots
              }, {
                label: '180-Day Moving Average',
                data: movingAverage180Days,
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0, // Disable the dots
              }, {
                label: '365-Day Moving Average',
                data: movingAverage365Days,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0, // Disable the dots
              }]
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
    const cleanedPrices = removeOutliers(prices); // Remove outliers from prices
    const movingAverage = calculateMovingAverage(cleanedPrices, 30); // Using 30 days moving average for projection
    const projection = linearRegression(cleanedPrices, 12);
    
    // Generate past price labels and projection labels
    const pastLabels = cleanedPrices.map((_, i) => `Day ${i + 1}`); // Generate labels for past prices
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
            const pastPrices = ${JSON.stringify(cleanedPrices)};
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
                datasets: [{
                  label: '${indexName} Prices',
                  data: pastPrices,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                  fill: false,
                  pointRadius: 0, // Disable the dots
                }, {
                  label: '30-Day Moving Average',
                  data: movingAverage,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                  fill: false,
                  pointRadius: 0, // Disable the dots
                }, {
                  label: 'Projection',
                  data: projection,
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 2,
                  fill: false,
                  pointRadius: 0, // Disable the dots
                }]
              },
              options: {
                scales: {
                  x: { title: { display: true, text: 'Days / Months' } },
                  y: { title: { display: true, text: 'Price' } }
                }
              }
            });
          </script>
      </body>
      </html>
    `;
}

// Routes for serving different index charts and projections
router.get("/chart/all-skins", (context) => serveChart(context, AllSkinsIndex, "All Skins"));
router.get("/chart/st-marc", (context) => serveChart(context, StMarcIndex, "St Marc"));
router.get("/chart/canals", (context) => serveChart(context, CanalsIndex, "Canals"));
router.get("/chart/norse", (context) => serveChart(context, NorseIndex, "Norse"));
router.get("/chart/gray", (context) => serveChart(context, GrayIndex, "Gray"));
router.get("/chart/lightblue", (context) => serveChart(context, LightblueIndex, "Lightblue"));
router.get("/chart/blue", (context) => serveChart(context, BlueIndex, "Blue"));
router.get("/chart/purple", (context) => serveChart(context, PurpleIndex, "Purple"));

// Routes for serving projections
router.get("/projection/all-skins", (context) => serveProjection(context, AllSkinsIndex, "All Skins"));
router.get("/projection/st-marc", (context) => serveProjection(context, StMarcIndex, "St Marc"));
router.get("/projection/canals", (context) => serveProjection(context, CanalsIndex, "Canals"));
router.get("/projection/norse", (context) => serveProjection(context, NorseIndex, "Norse"));
router.get("/projection/gray", (context) => serveProjection(context, GrayIndex, "Gray"));
router.get("/projection/lightblue", (context) => serveProjection(context, LightblueIndex, "Lightblue"));
router.get("/projection/blue", (context) => serveProjection(context, BlueIndex, "Blue"));
router.get("/projection/purple", (context) => serveProjection(context, PurpleIndex, "Purple"));

export { router };
