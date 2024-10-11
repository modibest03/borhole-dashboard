import 'bootstrap/dist/css/bootstrap.min.css';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import './App.css';

// Registering required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define a type for the sensor data
interface SensorData {
  waterLevel: number;
  temperature: number;
  pH: number;
  turbidity: number;
}

// Function to simulate sensor data
const generateSensorData = (): SensorData => {
  return {
    waterLevel: Math.random() * 100, // Random water level (0 to 100)
    temperature: Math.random() * 50, // Random temperature (0 to 50 degrees Celsius)
    pH: Math.random() * 4 + 5, // Random pH (5 to 9)
    turbidity: Math.random() * 300, // Random turbidity (0 to 300 NTU)
  };
};

const App: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    waterLevel: 0,
    temperature: 0,
    pH: 0,
    turbidity: 0,
  });
  const [alert, setAlert] = useState<string | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);

  useEffect(() => {
    // Update sensor data every 2 seconds
    const interval = setInterval(() => {
      const newData = generateSensorData();
      setSensorData(newData);

      // Append new data to the historical data
      setHistory((prevHistory) => [...prevHistory, newData]);

      // Check for alerts based on threshold values
      if (newData.waterLevel > 80) {
        setAlert(
          `ALERT: Water level is too high (${newData.waterLevel.toFixed(2)}%)`
        );
      } else if (newData.temperature > 40) {
        setAlert(
          `ALERT: Temperature is too high (${newData.temperature.toFixed(2)}°C)`
        );
      } else if (newData.pH < 6.5 || newData.pH > 8.5) {
        setAlert(
          `ALERT: pH level is out of safe range (${newData.pH.toFixed(2)})`
        );
      } else if (newData.turbidity > 250) {
        setAlert(
          `ALERT: Turbidity is too high (${newData.turbidity.toFixed(2)} NTU)`
        );
      } else {
        setAlert(null);
      }
    }, 2000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  // Prepare data for the charts
  const chartData = {
    labels: history.map((_, index) => index + 1), // x-axis label as time
    datasets: [
      {
        label: 'Water Level (%)',
        data: history.map((d) => d.waterLevel),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Temperature (°C)',
        data: history.map((d) => d.temperature),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
      {
        label: 'pH Level',
        data: history.map((d) => d.pH),
        borderColor: 'rgba(54,162,235,1)',
        fill: false,
      },
      {
        label: 'Turbidity (NTU)',
        data: history.map((d) => d.turbidity),
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      },
    ],
  };

  return (
    <div className='App container'>
      <h1 className='mt-5'>Borehole Monitoring Dashboard</h1>

      <div className='sensor-data mt-4 row'>
        <div className='col-md-3'>
          <div className='card text-center'>
            <div className='card-body'>
              <h5 className='card-title'>Water Level</h5>
              <p className='card-text'>{sensorData.waterLevel.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card text-center'>
            <div className='card-body'>
              <h5 className='card-title'>Temperature</h5>
              <p className='card-text'>{sensorData.temperature.toFixed(2)}°C</p>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card text-center'>
            <div className='card-body'>
              <h5 className='card-title'>pH Level</h5>
              <p className='card-text'>{sensorData.pH.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card text-center'>
            <div className='card-body'>
              <h5 className='card-title'>Turbidity</h5>
              <p className='card-text'>{sensorData.turbidity.toFixed(2)} NTU</p>
            </div>
          </div>
        </div>
      </div>

      {alert ? (
        <div className='alert alert-danger mt-4'>{alert}</div>
      ) : (
        <div className='alert alert-success mt-4'>All systems normal</div>
      )}

      <div className='mt-5'>
        <h3>Sensor Data Over Time</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default App;
