package com.marsa_maroc.entities;

import com.marsa_maroc.enumeration.Role;
import jakarta.persistence.*;

import jdk.jfr.DataAmount;
import lombok.*;
import org.springframework.boot.autoconfigure.web.WebProperties;

@Entity
@Getter @Setter @ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;
    @Column(nullable = false,unique = true)
    private String username;
    @Column(nullable = false,unique = true)
    private String password;
    private Role role;
}
