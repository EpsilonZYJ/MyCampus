// src/pages/user/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { registerUser } from "../../api/MockUser";

const { Text, Link } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const res = await registerUser(values);
      if (res.success) {
        message.success("注册成功，请登录！");
        navigate("/login", { replace: true });
      } else {
        message.error(res.message || "注册失败");
      }
    } catch (err) {
      message.error("注册失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: 360, margin: "80px auto" }}>
      <h2 style={{ textAlign: "center" }}>注册</h2>
      <Form
        layout="vertical"
        onFinish={handleRegister}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="userName"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入邮箱" },
            { type: "email", message: "请输入有效邮箱" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="phoneNumber"
          rules={[
            { required: true, message: "请输入手机号" },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: "请输入有效手机号",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="学号"
          name="studentId"
          rules={[{ required: true, message: "请输入学号" }]}
        >
          <Input />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
        >
          注册
        </Button>
      </Form>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Text>已有账号？ </Text>
        <Link onClick={() => navigate("/login")}>去登录</Link>
      </div>
    </div>
  );
}
