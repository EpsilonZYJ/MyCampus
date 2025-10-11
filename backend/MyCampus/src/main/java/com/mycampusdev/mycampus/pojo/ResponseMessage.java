package com.mycampusdev.mycampus.pojo;

import org.springframework.http.HttpStatus;

/**
 * 通用响应消息封装类，用于统一接口返回格式。
 *
 * @param <T> 响应数据类型
 */
public class ResponseMessage<T> {
    /** 状态码 */
    private Integer code;
    /** 响应消息 */
    private String message;
    /** 响应数据 */
    private T data;

    /**
     * 构造方法，初始化响应消息对象。
     * @param code 状态码
     * @param message 响应消息
     * @param data 响应数据
     */
    public ResponseMessage(Integer code, String message, T data){
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 返回成功响应消息。
     * @param data 响应数据
     * @param <T> 数据类型
     * @return ResponseMessage 对象
     */
    public static <T> ResponseMessage<T> success(T data){
        return new ResponseMessage<T>(HttpStatus.OK.value(), "success", data);
    }

    /**
     * 获取状态码。
     * @return 状态码
     */
    public Integer getCode() {
        return code;
    }

    /**
     * 设置状态码。
     * @param code 状态码
     */
    public void setCode(Integer code) {
        this.code = code;
    }

    /**
     * 获取响应消息。
     * @return 响应消息
     */
    public String getMessage() {
        return message;
    }

    /**
     * 设置响应消息。
     * @param message 响应消息
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * 获取响应数据。
     * @return 响应数据
     */
    public T getData() {
        return data;
    }

    /**
     * 设置响应数据。
     * @param data 响应数据
     */
    public void setData(T data) {
        this.data = data;
    }

    /**
     * 返回错误响应消息。
     * @param code 状态码
     * @param message 错误信息
     * @param <T> 数据类型
     * @return ResponseMessage 对象
     */
    public static <T> ResponseMessage<T> error(int code, String message) {
        ResponseMessage<T> response = new ResponseMessage<>(code, message, null);
        return response;
    }
}
