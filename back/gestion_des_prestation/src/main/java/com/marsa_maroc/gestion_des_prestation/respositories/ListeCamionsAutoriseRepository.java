package com.marsa_maroc.gestion_des_prestation.respositories;

import com.marsa_maroc.gestion_des_prestation.entities.ListeCamionsAutorises;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListeCamionsAutoriseRepository extends JpaRepository<ListeCamionsAutorises, Integer> {
    List<ListeCamionsAutorises> findByPrestationNumeroPrestation(String numeroPrestation);
    List<ListeCamionsAutorises> findByCamionImmatriculation(String immatriculation);

    @Query("SELECT lca FROM ListeCamionsAutorises lca WHERE lca.prestation.numeroPrestation = ?1 AND lca.camion.immatriculation = ?2")
    ListeCamionsAutorises findByPrestationAndCamion(String numeroPrestation, String immatriculation);

    boolean existsByPrestationNumeroPrestationAndCamionImmatriculation(String numeroPrestation, String immatriculation);
}