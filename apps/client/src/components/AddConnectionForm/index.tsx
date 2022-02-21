import { Button, Form, Input, Space } from "antd";
import { useAddConnectionForm } from "./useAddConnectionForm";

type Props = {
  onCancel: () => void;
};

const AddConnectionForm = ({ onCancel }: Props) => {
  const { onAddConnection } = useAddConnectionForm({
    onCancel,
  });

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      onFinish={onAddConnection}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your connection name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Host"
        name="host"
        rules={[
          {
            required: true,
            message: "Please input your connection host!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Port"
        name="port"
        rules={[
          {
            required: true,
            message: "Please input your connection port!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Username" name="username">
        <Input />
      </Form.Item>

      <Form.Item label="Password" name="password">
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Space>
          <Button type="primary" htmlType="submit" shape="round">
            Submit
          </Button>
          <Button type="default" shape="round" onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddConnectionForm;
