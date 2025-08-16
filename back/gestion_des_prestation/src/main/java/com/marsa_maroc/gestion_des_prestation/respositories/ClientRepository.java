package com.marsa_maroc.gestion_des_prestation.respositories;




import com.marsa_maroc.gestion_des_prestation.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {
    Optional<Client> findByCodeClient(String codeClient);
    boolean existsByCodeClient(String codeClient);

}