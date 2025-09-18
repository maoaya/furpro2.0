import React from 'react';
import { List } from 'antd';

function TeamList({ teams }) {
  return (
    <List
      bordered
      dataSource={teams}
      renderItem={item => (
        <List.Item>
          <b>{item.name}</b> - {item.category}
        </List.Item>
      )}
    />
  );
}

export default TeamList;
