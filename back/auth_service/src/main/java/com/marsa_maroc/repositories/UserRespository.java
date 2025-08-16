package com.marsa_maroc.repositories;

import com.marsa_maroc.entities.AppUser;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRespository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByusername(String username);


}
