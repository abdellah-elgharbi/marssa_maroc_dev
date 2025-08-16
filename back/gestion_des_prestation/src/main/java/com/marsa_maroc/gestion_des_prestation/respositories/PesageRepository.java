package com.marsa_maroc.gestion_des_prestation.respositories;


import com.marsa_maroc.gestion_des_prestation.entities.Pesage;
import com.marsa_maroc.gestion_des_prestation.enums.TypePesage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PesageRepository extends JpaRepository<Pesage, Integer> {
    List<Pesage> findByPrestationNumeroPrestation(String numeroPrestation);
    List<Pesage> findByCamionImmatriculation(String immatriculation);
    List<Pesage> findByTypePesage(TypePesage typePesage);
    List<Pesage> findByDatePesageBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT p FROM Pesage p WHERE p.prestation.numeroPrestation = ?1 AND p.typePesage = ?2")
    List<Pesage> findByPrestationAndTypePesage(String numeroPrestation, TypePesage typePesage);
}