import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  InputNumber,
  Switch,
  Rate,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createDish } from "../../api/dish";

const { TextArea } = Input;
const { Option } = Select;

const categories = ["川菜", "本帮菜", "快餐", "主食", "汤", "小吃", "粉面", "凉菜", "家常菜"];
const restaurants = ["百景园食堂", "东园食堂", "西园食堂", "学子餐厅", "西一食堂一楼", "集锦园食堂一楼", "东一食堂一楼", "西一食堂二楼清真食堂", "西二食堂二楼", "东一食堂二楼", "喻园餐厅", "西一民族食堂","百景园一楼", "百惠园"];



export default function UploadDishPage() {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);
  const [form] = Form.useForm();
  
  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      message.error("请上传菜品图片");
      return;
    }

    const file = fileList[0];
    const formData = new FormData();
    formData.append("dishName", values.name);
    formData.append("restaurant", values.restaurant);
    formData.append("category", values.category);
    formData.append("price", values.price);
    // 使用ratingValue作为主要评分来源，确保不为0时正确传递
    formData.append("rating", ratingValue || 0);
    console.log("提交的评分值:", ratingValue); // 添加调试日志
    formData.append("description", values.description || "");
    formData.append("isAvailable", values.isAvailable ?? true);
    formData.append("imageData", file.originFileObj || file);

    try {
      const res = await createDish(formData);
      if (res) {
        message.success("上传成功！");
        navigate("/food");
      } else {
        message.error("上传失败，请重试");
      }
    } catch (err) {
      console.error(err);
      message.error("上传失败，请重试");
    }
  };

  return (
    <>
      <Navbar />
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
        <div style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center", 
          alignItems: "center",
          padding: "40px 20px",
          position: "relative",
          marginTop: "80px", // 添加顶部外边距
        }}>
        <div
          style={{
            width: "800px",  // 固定宽度
            margin: "0 auto",
            padding: "20px 60px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            background: "#fff",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: 32,
              fontSize: "26px",
              fontWeight: "600",
              color: "#000",
            }}
          >
            上传菜品
          </h1>

          <Form layout="vertical" onFinish={handleUpload} form={form}>
            {/* 第一行：菜品名称 + 餐厅 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="菜品名称"
                  name="name"
                  rules={[{ required: true, message: "请输入菜品名称" }]}
                >
                  <Input placeholder="例如：宫保鸡丁" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="餐厅"
                  name="restaurant"
                  rules={[{ required: true, message: "请选择餐厅" }]}
                >
                        <Select placeholder="选择餐厅">
                      {restaurants.map(restaurant => (
                <Option key={restaurant} value={restaurant}>{restaurant}</Option>
              ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* 第二行：分类 + 价格 */}
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label="分类"
                  name="category"
                  rules={[{ required: true, message: "请选择分类" }]}
                >
                  <Select placeholder="选择分类">
                  {categories.map(category => (
          <Option key={category} value={category}>{category}</Option>
        ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="价格（元）"
                  name="price"
                  rules={[{ required: true, message: "请输入价格" }]}
                >
                  <InputNumber
                    min={0}
                    step={0.5}
                    style={{ width: "100%" }}
                    placeholder="例如：15"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* 第三行：评分 + 是否可供应 */}
            <Row gutter={24} align="middle">
              <Col span={12}>
              <Form.Item label="评分" name="rating" initialValue={0}>
              <Rate
                allowHalf
                value={ratingValue}
                onChange={(value) => {
                  setRatingValue(value);
                  form.setFieldValue('rating', value);
                }}
              />
              <span style={{ marginLeft: 8 }}>
                {ratingValue ? `${ratingValue}星` : "未评分"}
              </span>
            </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="是否可供应"
                  name="isAvailable"
                  valuePropName="checked"
                >
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
            </Row>



            <Form.Item label="菜品描述" name="description">
              <TextArea rows={4} placeholder="简单描述一下这道菜吧~" />
            </Form.Item>

            <Form.Item label="菜品图片" required>
              <Upload
                beforeUpload={(file) => {
                  setFileList([file]);
                  return false;
                }}
                onRemove={() => setFileList([])}
                fileList={fileList}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>选择图片</Button>
              </Upload>
            </Form.Item>

            <Form.Item> 
              <Button type="primary" htmlType="submit" block
              style={{ backgroundColor: "rgb(252, 140, 59)", borderColor: "rgb(252, 140, 59)" }}>
                 上传菜品 
                 </Button> 
            </Form.Item>




          </Form>
        </div>
        </div>
        </div>
          </>
  );
}
