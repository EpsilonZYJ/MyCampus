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


export default function UploadDishPage() {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  
const [ratingValue, setRatingValue] = useState(0);

  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      message.error("请上传菜品图片");
      return;
    }

    const file = fileList[0];
    const formData = new FormData();
    formData.append("dish_name", values.name);
    formData.append("restaurant", values.restaurant);
    formData.append("category", values.category);
    formData.append("price", values.price);
    formData.append("rating", values.rating || 0);
    formData.append("description", values.description || "");
    formData.append("review_count", 0);
    formData.append("isAvailable", values.isAvailable ?? true);
    formData.append("created_at", new Date().toISOString());
    formData.append("updated_at", new Date().toISOString());
    formData.append("image", file.originFileObj || file);

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
          backgroundColor: "#fff",
          minHeight: "100vh",
          paddingTop: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "800px",  // 固定宽度
            margin: "0 auto",
            padding: "40px 60px",
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

          <Form layout="vertical" onFinish={handleUpload}>
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
                    <Option value="东一食堂">东一食堂</Option>
                    <Option value="东二食堂">东二食堂</Option>
                    <Option value="西一食堂">西一食堂</Option>
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
                    <Option value="川菜">川菜</Option>
                    <Option value="粤菜">粤菜</Option>
                    <Option value="湘菜">湘菜</Option>
                    <Option value="鲁菜">鲁菜</Option>
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
  <Form.Item label="评分">
  <Rate
    allowHalf
    value={ratingValue}   // 绑定 state
    onChange={(value) => setRatingValue(value)} // 更新 state
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
              <Button type="primary" htmlType="submit" block>
                 上传菜品 
                 </Button> 
            </Form.Item>




          </Form>
        </div>
      </div>
    </>
  );
}
