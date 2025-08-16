package com.marsa_maroc.gestion_des_prestation.respositories;


import com.marsa_maroc.gestion_des_prestation.entities.Prestation;
import com.marsa_maroc.gestion_des_prestation.enums.Statut;
import com.marsa_maroc.gestion_des_prestation.enums.TypeOperation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrestationRepository extends JpaRepository<Prestation, String> {
    List<Prestation> findByStatut(Statut statut);
    List<Prestation> findByClientIdClient(Integer clientId);
    List<Prestation> findByNavireIdNavire(Integer navireId);
    List<Prestation> findByTypeOperation(TypeOperation typeOperation);
    List<Prestation> findByDateCreationBetween(LocalDate startDate, LocalDate endDate);

//    @EntityGraph(attributePaths = {"client", "navire"})
//    List<Prestation> findAllWithclientAndnavire();

    @Query("SELECT p FROM Prestation p WHERE p.dateArrivee BETWEEN ?1 AND ?2")
    List<Prestation> findByDateArriveeBetween(LocalDate startDate, LocalDate endDate);
}
