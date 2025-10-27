import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Form, Input, Button, Typography } from "antd";
import { loginUser } from "../../api/userLogin";

const { Text, Link } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        console.log("[Login] Login process started");
        console.log(`[Login] Username: ${values.userName}, Time: ${new Date().toLocaleString('zh-CN')}`);

        // 清除之前的错误信息
        setErrorMsg("");
        setLoading(true);
        try {
            const requestData = {
                userName: values.userName,
                password: values.password
            };
            console.log("[Login] Request data to backend:", requestData);
            console.log("[Login] Calling backend login API...");

            const res = await loginUser(values.userName, values.password);
            console.log("[Login] Backend response received");
            console.log("[Login] Response data:", res);

            if (res.success && res.data && res.data.token) {
                console.log("[Login] Response contains token:", res.data.token);
                console.log("[Login] Response contains user:", res.data.user);

                // 存储登录信息
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                // 设置当前角色 - 使用用户的第一个角色作为默认角色
                const userRoles = res.data.user?.roles || [];
                const defaultRole = userRoles[0] || 'ROLE_STUDENT';
                localStorage.setItem("currentRole", defaultRole);
                console.log("[Login] Current role set to:", defaultRole);

                console.log("[Login] ✅ Login successful!");
                console.log("[Login] User info saved to localStorage");
                console.log("[Login] User ID:", res.data.user?.id);
                console.log("[Login] User name:", res.data.user?.userName);
                console.log("[Login] User email:", res.data.user?.email);
                console.log("[Login] User phone:", res.data.user?.phoneNumber);
                console.log("[Login] User studentId:", res.data.user?.studentId);
                console.log("[Login] User roles:", res.data.user?.roles);
                console.log("[Login] User balance:", res.data.user?.balance);

                message.success("登录成功！");

                // 使用 window.location.href 强制刷新页面,确保状态更新
                // 根据角色跳转到对应页面
                setTimeout(() => {
                    if (defaultRole === 'ROLE_ADMIN') {
                        window.location.href = '/admin/runners';
                        console.log("[Login] Navigating to admin page");
                    } else if (defaultRole === 'ROLE_RUNNER') {
                        window.location.href = '/runner-orders';
                        console.log("[Login] Navigating to runner page");
                    } else {
                        window.location.href = '/';
                        console.log("[Login] Navigating to home page");
                    }
                }, 500); // 延迟 500ms 让用户看到成功消息
            } else {
                console.log("[Login] ❌ Login failed: Invalid response or credentials");
                console.log("[Login] Response structure:", {
                    success: res.success,
                    hasData: !!res.data,
                    hasToken: !!res.data?.token,
                    hasUser: !!res.data?.user,
                    errorMessage: res.message,
                    response: res
                });

                // 显示后端返回的错误信息
                const errorMessage = res.message || "用户名或密码错误";
                setErrorMsg(errorMessage);
                message.error(errorMessage);
                console.log("[Login] Error message displayed to user:", errorMessage);
            }
        } catch (err) {
            console.error("[Login] ❌ Login exception:", err);
            console.error(`[Login] Error details: ${err.message}`);
            const errorMessage = "登录失败，请稍后再试";
            setErrorMsg(errorMessage);
            message.error(errorMessage);
            console.log("[Login] Error message displayed to user:", errorMessage);
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

            {/* 错误信息提示 - 一行显示 */}
            {errorMsg && (
                <div style={{
                    color: '#ff4d4f',
                    backgroundColor: '#fff2f0',
                    border: '1px solid #ffccc7',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    fontSize: '14px',
                    textAlign: 'center',
                    marginTop: '16px'
                }}>
                    ❌ {errorMsg}
                </div>
            )}

            <div style={{ textAlign: "center", marginTop: 16 }}>
                <Text>没有账号？ </Text>
                <Link onClick={() => navigate("/register")}>去注册</Link>
            </div>
        </div>
    );
}
