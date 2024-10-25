package com.chatapp.userservice.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(Exception exception, WebRequest request){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ErrorDetails.builder()
                    .time(new Timestamp(System.currentTimeMillis()))
                    .message(exception.getMessage())
                    .details(request.getDescription(false))
                    .build()
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorDetails> handleRuntimeException(RuntimeException runtimeException,WebRequest webRequest){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ErrorDetails.builder()
                        .time(new Timestamp(System.currentTimeMillis()))
                        .message(runtimeException.getMessage())
                        .details(webRequest.getDescription(false))
                        .build()
        );
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorDetails> handleApiException(ApiException apiException,WebRequest webRequest){
        return ResponseEntity.status(apiException.getHttpStatus()).body(
                ErrorDetails.builder()
                        .time(new Timestamp(System.currentTimeMillis()))
                        .message(apiException.getMessage())
                        .details(webRequest.getDescription(false))
                        .build()
        );
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        Map<String,String> errors=new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(
                error -> {
                    if (error instanceof FieldError) {
                        String fieldName = ((FieldError)error).getField();
                        String message = error.getDefaultMessage();
                        errors.put(fieldName,message);
                    }
                }
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorDetails.builder()
                        .time(new Timestamp(System.currentTimeMillis()))
                        .message(errors)
                        .details(request.getDescription(false))
                        .build()
        );
    }

}
