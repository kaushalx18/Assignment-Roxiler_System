import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatisticsDisplay = ({ month }) => {
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        const fetchStatistics = async () => {
            const response = await axios.get('/api/statistics', { params: { month } });
            setStatistics(response.data);
        };
        fetchStatistics();
    }, [month]);

    return (
        <div>
            <h2>Statistics</h2>
            <p>Total Sales: {statistics.totalSales}</p>
            <p>Total Sold Items: {statistics.soldItems}</p>
            <p>Total Not Sold Items: {statistics.totalNotSold}</p>
        </div>
    );
};

export default StatisticsDisplay;