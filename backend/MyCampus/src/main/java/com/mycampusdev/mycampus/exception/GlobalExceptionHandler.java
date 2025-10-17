package com.mycampusdev.mycampus.exception;

import java.util.HashMap;
import java.util.Map;

import org.hibernate.validator.internal.util.logging.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.mycampusdev.mycampus.pojo.ResponseMessage;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestControllerAdvice  // 统一异常处理
public class GlobalExceptionHandler {

    Logger log = org.slf4j.LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({Exception.class})  // 指定要处理的异常类型(所有的)
    public ResponseMessage exceptionHandler(Exception e,HttpServletRequest request,HttpServletResponse response){
        log.error("统一异常：",e);

        return new ResponseMessage(500, e.getMessage(), "Internal Server Error.");
    }

}
