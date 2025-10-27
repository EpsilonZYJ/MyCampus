import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Form, Input, Button, Typography } from "antd";
import { mockLogin } from "../../api/MockUser";

const { Text, Link } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        console.log("[Login] Login process started");
        console.log(`[Login] Username: ${values.userName}, Time: ${new Date().toLocaleString('zh-CN')}`);

        setLoading(true);
        try {
            console.log("[Login] Calling login API...");
            const res = await mockLogin(values.userName, values.password);
            console.log("[Login] API response:", res);

            if (res) {
                // 存储登录信息
                localStorage.setItem("token", res.token || "mock-token");
                localStorage.setItem("user", JSON.stringify(res.user || res));

                console.log("[Login] ✅ Login successful!");
                console.log("[Login] User info saved to localStorage");
                console.log(`[Login] User role: ${res.user?.role || res.role}`);

                message.success("登录成功！");
                navigate("/", { replace: true }); // 登录成功后跳回首页
                console.log("[Login] Navigating to home page");
            } else {
                console.log("[Login] ❌ Login failed: Invalid username or password");
                message.error("用户名或密码错误");
            }
        } catch (err) {
            console.error("[Login] ❌ Login exception:", err);
            console.error(`[Login] Error details: ${err.message}`);
            message.error("登录失败，请稍后再试");
        } finally {
            setLoading(false);
            console.log("[Login] Login process ended\n");
        }
    };

    return (
        <div style={{ width: 320, margin: "100px auto" }}>
            <h2 style={{ textAlign: "center" }}>登录</h2>
            <Form onFinish={handleLogin} layout="vertical">
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

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                >
                    登录
                </Button>
            </Form>

            <div style={{ textAlign: "center", marginTop: 16 }}>
                <Text>没有账号？ </Text>
                <Link onClick={() => navigate("/register")}>去注册</Link>
            </div>
        </div>
    );
}
