package com.marsa_maroc.util;

import jakarta.validation.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ExeptionHandeler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map> GlobalValidationHandeler(MethodArgumentNotValidException ex){
    Map<String ,String > errors=new HashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(err->{
      errors.put(err.getField(),err.getDefaultMessage());
    });
    return ResponseEntity.badRequest().body(errors);
  }
  @ExceptionHandler(UserPrincipalNotFoundException.class)
  public ResponseEntity<String> userPricipalNotFoundException(UserPrincipalNotFoundException ex){
    return ResponseEntity.notFound().build();
  }
  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> exeption(Exception ex){
    return new  ResponseEntity<>("errr dans le serveur"+ ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
