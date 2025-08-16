package com.marsa_maroc.gestion_des_prestation.respositories;
import com.marsa_maroc.gestion_des_prestation.entities.Navire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NavireRepository extends JpaRepository<Navire, Integer> {
    Optional<Navire> findByCodeNavire(String codeNavire);
    boolean existsByCodeNavire(String codeNavire);

    @Query("SELECT n FROM Navire n WHERE n.nomNavire LIKE %?1%")
    List<Navire> findByNomNavireContaining(String nomNavire);
}