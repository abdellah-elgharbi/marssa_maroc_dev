package com.marsa_maroc.controllers;

import com.marsa_maroc.dto.AuthRequest;
import com.marsa_maroc.entities.AppUser;
import com.marsa_maroc.mapper.UserMapper;
import com.marsa_maroc.servicies.JwtService;
import com.marsa_maroc.util.JwtToken;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/")
public class AuthController {

     private final JwtService jwtService;
     private final UserMapper userMapper;
    public AuthController(JwtService jwtService, UserMapper userMapper) {

        this.jwtService = jwtService;
        this.userMapper = userMapper;
    }

    @PostMapping("login")
    public ResponseEntity<JwtToken> login(@Validated @RequestBody AuthRequest authRequest) throws BadRequestException {

        AppUser appUser=  userMapper.AuthRequestToAppUser(authRequest);
        if(appUser.equals(null)){
            throw new BadRequestException();
        }
        Authentication  authentication =jwtService.getAuthentication(appUser);
        String accessToken=jwtService.generateAcessToken(authentication);
        String refReshToken =jwtService.generateRefreshToken(authentication.getName());
        JwtToken jwtToken = new JwtToken(accessToken,refReshToken);
        return ResponseEntity.ok(jwtToken);
    }
   @PostMapping("getToken")
    public  ResponseEntity<JwtToken> getAcceesToken(@RequestBody JwtToken refreshToken) throws BadRequestException {
	       String refToken= refreshToken.refreshToken();
           String accessToken = jwtService.getAccessToken(refToken);
           JwtToken token=new JwtToken(accessToken,refToken);
           return ResponseEntity.ok(token);
   }
   @PostMapping("hello")
    public ResponseEntity<String> hello(@Validated @RequestBody AuthRequest authRequest) throws BadRequestException {
        return  ResponseEntity.ok("hello");
   }
}
