package com.marsa_maroc.servicies;

import com.marsa_maroc.entities.AppUser;
import com.marsa_maroc.enumeration.Role;
import com.marsa_maroc.mapper.UserMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    public JwtService(AuthenticationManager authenticationManager, UserMapper userMapper, CustomUserDetailsService customUserDetailsService, JwtEncoder jwtEncoder, JwtDecoder jwtDecoder) {
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = customUserDetailsService;

        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
    }

    public String generateAcessToken(Authentication authentication) {
            Collection<? extends GrantedAuthority> authority =authentication.getAuthorities();
            String username = authentication.getName();
            String scope=fromGrantedAuthoritiesToString(authority);
            Instant now = Instant.now();
            JwtClaimsSet jwtC= JwtClaimsSet.builder()
                    .subject(username)
                    .expiresAt(now.plus(24, ChronoUnit.HOURS))
                    .claim("scope", scope)
                    .issuedAt(now)
                    .build();
            return jwtEncoder.encode(JwtEncoderParameters.from(jwtC)).getTokenValue();
    }
    public String generateRefreshToken(String username) {

        JwtClaimsSet jwtC= JwtClaimsSet.builder()
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plus(30,ChronoUnit.DAYS))
                .subject(username)
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(jwtC)).getTokenValue();
    }

    private String  fromGrantedAuthoritiesToString(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream().map(authoritie-> authoritie.toString()).collect(Collectors.joining(" "));
    }

    public String getAccessToken(String Reftoken) {

        String username= fromRefreshTokenTousername(Reftoken);
        UserDetails userDetails = getUserByYsername(username);
        if(userDetails!=null){
            String subject=userDetails.getUsername();
            Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
            String scope=fromGrantedAuthoritiesToString(authorities);
            Instant now = Instant.now();
            JwtClaimsSet jwtC= JwtClaimsSet.builder()
                    .subject(subject)
                    .expiresAt(now.plus(5, ChronoUnit.MINUTES))
                    .claim("scope",scope)
                    .issuedAt(now)
                    .build();
            return jwtEncoder.encode(JwtEncoderParameters.from(jwtC)).getTokenValue();
        }else{
            throw new BadCredentialsException("Invalid Refresh Token");
        }


    }


    public Authentication getAuthentication(AppUser appUser) {
        if(appUser.equals(null)){
            throw new BadCredentialsException("Bad credentials");
        }
        try{
            Authentication authentication= authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(appUser.getUsername(), appUser.getUsername()));
            return authentication;
        }catch (Exception e){
            throw new BadCredentialsException("Invalid username or password");
        }
    }



    public String fromRefreshTokenTousername (String refreshToken) {
        Jwt jwt = jwtDecoder.decode(refreshToken);
        String username = jwt.getSubject();
        System.out.println(username);
        System.out.println(jwt.getSubject());
        return username;
    }
   public UserDetails getUserByYsername (String username) {
         UserDetails  user=customUserDetailsService.loadUserByUsername(username);
         return user;
   }
}
