package com.marsa_maroc.gestion_des_prestation.respositories;


import com.marsa_maroc.gestion_des_prestation.entities.Camion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CamionRepository extends JpaRepository<Camion, String> {


    @Query("SELECT c FROM Camion c WHERE c.transporteur LIKE %?1%")
    List<Camion> findCamionsByTransporteurName(String nomTransporteur);


}