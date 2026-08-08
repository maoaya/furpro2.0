import React from 'react';
import { Form, Input, Button } from 'antd';

function JudgeAssignForm({ onSubmit }) {
  return (
    <Form layout="inline" onFinish={onSubmit} style={{ marginBottom: 24 }}>
      <Form.Item name="judge" label="Juez">
        <Input placeholder="Nombre del juez" />
      </Form.Item>
      <Button type="primary" htmlType="submit">Asignar</Button>
    </Form>
  );
}

export default JudgeAssignForm;
