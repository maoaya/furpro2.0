import React from 'react';
import { Table } from 'antd';

const columns = [
  { title: 'Posición', dataIndex: 'position', key: 'position' },
  { title: 'Nombre', dataIndex: 'name', key: 'name' },
  { title: 'Tipo', dataIndex: 'type', key: 'type' },
  { title: 'Puntos', dataIndex: 'points', key: 'points' },
];

function RankingTable({ data }) {
  // Ensure each item has a unique 'id' property
  const formattedData = data.map((item, index) => ({
    ...item,
    id: item.id ?? index, // Assign index as id if id is missing
  }));

  return <Table columns={columns} dataSource={formattedData} pagination={false} rowKey="id" />;
}

export default RankingTable;
