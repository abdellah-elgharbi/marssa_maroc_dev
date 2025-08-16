package com.marsa_maroc.servicies;


import com.marsa_maroc.entities.AppUser;
import com.marsa_maroc.repositories.UserRespository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRespository userRespository;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserRespository userRespository, UserRespository userRespository1, PasswordEncoder passwordEncoder) {
        this.userRespository = userRespository1;
        this.passwordEncoder = passwordEncoder;
    }
    public AppUser createUser(AppUser etulisateur) {
        String password_hash=passwordEncoder.encode(etulisateur.getPassword());
        etulisateur.setPassword(password_hash);
        return userRespository.save(etulisateur);
    }
    public List<AppUser> getAllUsers() {
        return userRespository.findAll();
    }
    public AppUser getUserById(Long id) {
        return userRespository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + id));
    }

    // UPDATE
    public AppUser updateUser(Long id, AppUser newUserData) {
        AppUser existingUser = userRespository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + id));

        existingUser.setUsername(newUserData.getUsername());
        existingUser.setRole(newUserData.getRole());

        if (newUserData.getPassword() != null && !newUserData.getPassword().isBlank()) {
            String password_hash = passwordEncoder.encode(newUserData.getPassword());
            existingUser.setPassword(password_hash);
        }

        return userRespository.save(existingUser);
    }
    public void deleteUser(Long id) {
        AppUser user = userRespository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + id));

        // Empêche la suppression de l'admin root
        if ("ADMIN".equalsIgnoreCase(user.getRole().toString()) && "root".equalsIgnoreCase(user.getUsername())) {
            throw new RuntimeException("Impossible de supprimer l'utilisateur root avec le rôle ADMIN");
        }

        userRespository.deleteById(id);
    }

    public boolean existsByUsername(String username) {
        return userRespository.findByusername(username).isPresent();
    }



}
