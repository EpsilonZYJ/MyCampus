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
     * 返回成功响应消息，并处理data对象中可能包含的ImageData属性。
     * 如果ImageData属性为空，则在返回前将其设置为null。
     * @param data 响应数据
     * @param <T> 数据类型
     * @return 处理后的ResponseMessage对象
     */
    public static <T> ResponseMessage<T> successWithImageDataCheck(T data) {
        if (data != null) {
            try {
                // 使用反射检查data对象是否有getImageData方法
                Class<?> clazz = data.getClass();
                try {
                    java.lang.reflect.Method getImageDataMethod = clazz.getMethod("getImageData");
                    if (getImageDataMethod != null) {
                        Object imageData = getImageDataMethod.invoke(data);
                        // 如果ImageData属性为空，则设置为null
                        if (imageData == null || (imageData instanceof String && ((String) imageData).trim().isEmpty())) {
                            try {
                                java.lang.reflect.Method setImageDataMethod = clazz.getMethod("setImageData", String.class);
                                if (setImageDataMethod != null) {
                                    setImageDataMethod.invoke(data, (Object) null);
                                }
                            } catch (NoSuchMethodException ignored) {
                                // 如果没有setImageData方法，忽略异常
                            }
                        }
                    }
                } catch (NoSuchMethodException ignored) {
                    // 如果没有getImageData方法，忽略异常
                }
            } catch (Exception e) {
                // 捕获所有异常，避免影响正常响应
                System.err.println("处理ImageData属性时发生错误: " + e.getMessage());
            }
        }
        return new ResponseMessage<>(HttpStatus.OK.value(), "success", data);
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
