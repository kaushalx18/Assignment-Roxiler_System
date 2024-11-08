import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);

const PieChart = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchPieChartData = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pie-chart`, { params: { month } });
            setData(response.data);
        };
        fetchPieChartData();
    }, [month]);

    const chartData = {
        labels: data.map(item => item._id),
        datasets: [{
            data: data.map(item => item.count),
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ],
        }],
    };

    return (
        <div>
            <h2>Pie Chart - Categories</h2>
            <Pie data={chartData} />
        </div>
    );
};

export default PieChart;