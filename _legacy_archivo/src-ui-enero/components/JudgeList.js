import React from 'react';
import { List, Button } from 'antd';

function JudgeList({ judges, onAssign }) {
  return (
    <List
      bordered
      dataSource={judges}
      renderItem={item => (
  <List.Item key={item.id} actions={[<Button key={item.id + '-asignar'} type="primary" onClick={() => onAssign(item.id)}>Asignar</Button>]}> <b>{item.name}</b> - {item.experience} años </List.Item>
      )}
    />
  );
}

export default JudgeList;
