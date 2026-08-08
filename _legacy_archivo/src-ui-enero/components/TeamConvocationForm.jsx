import React from 'react';
import { Form, Input, Button } from 'antd';

function TeamConvocationForm({ onSubmit }) {
  return (
    <Form layout="inline" onFinish={onSubmit} style={{ marginBottom: 24 }}>
      <Form.Item name="player" label="Jugador">
        <Input placeholder="Nombre del jugador" />
      </Form.Item>
      <Button type="primary" htmlType="submit">Convocar</Button>
    </Form>
  );
}

export default TeamConvocationForm;
