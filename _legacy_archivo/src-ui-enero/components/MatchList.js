import React from 'react';
import { Table, Tag } from 'antd';

const columns = [
  { title: 'Fecha', dataIndex: 'date', key: 'date' },
  { title: 'Equipo A', dataIndex: 'teamA', key: 'teamA' },
  { title: 'Equipo B', dataIndex: 'teamB', key: 'teamB' },
  { title: 'Estado', dataIndex: 'status', key: 'status', render: status => <Tag color={status === 'Finalizado' ? 'green' : 'blue'}>{status}</Tag> },
];

function MatchList({ matches }) {
  return <Table columns={columns} dataSource={matches} pagination={false} rowKey="id" />;
}

export default MatchList;
