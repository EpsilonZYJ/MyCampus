import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { Form, Input, Select, Upload, Button, message, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createDish } from "../../api/dish"; // 使用你封装的接口

const { TextArea } = Input;
const { Option } = Select;

export default function UploadDishPage() {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);

  // 提交表单
  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      message.error("请上传菜品图片");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("category", values.category);
    formData.append("restaurant", values.restaurant);
    formData.append("price", values.price);
    formData.append("description", values.description || "");
    formData.append("image", fileList[0]); // 上传第一张图片

    try {
      const res = await createDish(formData);
      if (res) {
        message.success("上传成功！");
        navigate("/food"); // 上传成功后返回首页
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
      <div style={{ marginTop: 64, padding: 24 }}>
        <h1>上传菜品</h1>

        <Form
          layout="vertical"
          onFinish={handleUpload}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="菜品名称"
            name="name"
            rules={[{ required: true, message: "请输入菜品名称" }]}
          >
            <Input />
          </Form.Item>

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

          <Form.Item
            label="餐厅"
            name="restaurant"
            rules={[{ required: true, message: "请选择餐厅" }]}
          >
            <Select placeholder="选择餐厅">
              <Option value="餐厅A">餐厅A</Option>
              <Option value="餐厅B">餐厅B</Option>
              <Option value="餐厅C">餐厅C</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: "请输入价格" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="菜品图片" required>
            <Upload
              beforeUpload={(file) => {
                setFileList([file]);
                return false; // 阻止自动上传
              }}
              fileList={fileList}
              onRemove={() => setFileList([])}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>选择图片</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              上传
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
