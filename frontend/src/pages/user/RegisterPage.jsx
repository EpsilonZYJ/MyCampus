// src/pages/user/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { registerUser } from "../../api/userLogin";

const { Text, Link } = Typography;

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (values) => {
        console.log("[Register] Registration process started");
        console.log(`[Register] Username: ${values.userName}, Email: ${values.email}, Phone: ${values.phoneNumber}, StudentId: ${values.studentId}, Time: ${new Date().toLocaleString('zh-CN')}`);

        setLoading(true);
        try {
            console.log("[Register] Calling backend register API...");
            const res = await registerUser(values);
            console.log("[Register] API response:", res);

            if (res) {
                console.log("[Register] ✅ Registration successful!");
                console.log("[Register] New user info:", res);
                message.success("注册成功，请登录！");
                navigate("/login", { replace: true });
                console.log("[Register] Navigating to login page");
            } else {
                console.log("[Register] ❌ Registration failed: Invalid response");
                message.error("注册失败，请检查输入信息");
            }
        } catch (err) {
            console.error("[Register] ❌ Registration exception:", err);
            console.error(`[Register] Error details: ${err.message}`);
            message.error("注册失败，请稍后再试");
        } finally {
            setLoading(false);
            console.log("[Register] Registration process ended\n");
        }
    };

    return (
        <div
          style={{
            
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: "url('/imgs/login-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundColor: "transparent", // 避免底层灰色显示
          }}
        >
            <div
            style={{
                position: "relative",
              width: 320,
              padding: 24,
              borderRadius: 8,
              backgroundColor: "rgba(255, 255, 255, 0.8)", // 半透明白色
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            <img
            src="/imgs/美食.svg"   // public 目录下路径以 / 开头
            alt="美食"
            style={{
                position: "absolute",
                top: -30,
                right: -60,
                width: 200,
                height: 48,
            }}
            />
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
                    style={{ backgroundColor: "#ff9214", borderColor: "#ff9214" }}
                >
                    注册
                </Button>
            </Form>

            <div style={{ textAlign: "center", marginTop: 16 }}>
                <Text>已有账号？ </Text>
                <Link onClick={() => navigate("/login")}>去登录</Link>
            </div>
        </div>
        </div>
    );
}
