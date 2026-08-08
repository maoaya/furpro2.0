import React from 'react';
import { Card } from 'antd';
import { Bar } from 'react-chartjs-2';

function StatsChart({ data, options }) {
  return (
    <Card>
      <Bar data={data} options={options} />
    </Card>
  );
}

export default StatsChart;
