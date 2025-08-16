package com.marsa_maroc.mapper;

import com.marsa_maroc.dto.AuthRequest;
import com.marsa_maroc.dto.RegisterRequest;
import com.marsa_maroc.entities.AppUser;
import com.marsa_maroc.enumeration.Role;
import org.apache.tomcat.util.descriptor.web.ApplicationParameter;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    private final JwtDecoder jwtDecoder;

    public UserMapper(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }


    public  AuthRequest AppUserToAuthRequest (AppUser appUser) {
       return new AuthRequest(appUser.getUsername(), appUser.getPassword());
    }
    public AppUser AuthRequestToAppUser (AuthRequest authRequest) {
        AppUser appUser = AppUser.builder().username(authRequest.username()).password(authRequest.password()).build();
        return appUser;
    }
    public  AppUser RegisterRequestToAppUser(RegisterRequest registerRequest) {
        AppUser appUser = AppUser.builder().username(registerRequest.getUsername()).password(registerRequest.getPassword()).role(registerRequest.getRole()).build();
        return appUser;
    }
    public  RegisterRequest AppUserToRegisterRequest (AppUser appUser) {
        RegisterRequest registerRequest = RegisterRequest.builder().username(appUser.getUsername()).password(appUser.getPassword()).role(appUser.getRole()).build();

    return registerRequest;}

}
