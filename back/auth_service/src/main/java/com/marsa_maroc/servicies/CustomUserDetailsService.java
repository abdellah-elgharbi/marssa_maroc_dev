package com.marsa_maroc.servicies;

import com.marsa_maroc.entities.AppUser;

import com.marsa_maroc.repositories.UserRespository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

import static com.marsa_maroc.enumeration.Role.ADMIN;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private  final UserRespository userRespository;

    public CustomUserDetailsService(UserRespository userRespository) {
        this.userRespository = userRespository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        AppUser user = userRespository.findByusername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + username));

       System.out.println(user.getUsername());
        System.out.println(user.getPassword());
        System.out.println(user.getRole());
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.singletonList(authority))
                .build();
    }
}
