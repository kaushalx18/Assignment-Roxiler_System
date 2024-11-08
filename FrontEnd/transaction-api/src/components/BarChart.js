import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);

const BarChart = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchBarChartData = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bar-chart`, { params: { month } });
            setData(response.data);
        };
        fetchBarChartData();
    }, [month]);

    const chartData = {
        labels: data.map(item => item._id),
        datasets: [{
            label: 'Number of Items',
            data: data.map(item => item.count),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
    };

    return (
        <div>
            <h2>Bar Chart - Price Ranges</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default BarChart;