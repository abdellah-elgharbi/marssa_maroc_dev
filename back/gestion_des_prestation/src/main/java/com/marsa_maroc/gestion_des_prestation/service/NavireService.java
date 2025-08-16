package com.marsa_maroc.gestion_des_prestation.service;


import com.marsa_maroc.gestion_des_prestation.entities.Navire;
import com.marsa_maroc.gestion_des_prestation.exeptions.DuplicateResourceException;
import com.marsa_maroc.gestion_des_prestation.exeptions.ResourceNotFoundException;
import com.marsa_maroc.gestion_des_prestation.respositories.NavireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NavireService {

    private final NavireRepository navireRepository;

    @Transactional(readOnly = true)
    public List<Navire> getAllNavires() {
        return navireRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Navire getNavireById(Integer id) {
        return navireRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Navire non trouvé avec l'ID: " + id));
    }

    @Transactional(readOnly = true)
    public Navire getNavireByCode(String codeNavire) {
        return navireRepository.findByCodeNavire(codeNavire)
                .orElseThrow(() -> new ResourceNotFoundException("Navire non trouvé avec le code: " + codeNavire));
    }

    @Transactional(readOnly = true)
    public List<Navire> searchNaviresByNom(String nomNavire) {
        return navireRepository.findByNomNavireContaining(nomNavire);
    }

    public Navire createNavire(Navire navire) throws DuplicateResourceException {
        if (navireRepository.existsByCodeNavire(navire.getCodeNavire())) {
            throw new DuplicateResourceException("Un navire avec le code " + navire.getCodeNavire() + " existe déjà");
        }
        return navireRepository.save(navire);
    }

    public Navire updateNavire(Integer id, Navire navireDetails) throws DuplicateResourceException {
        Navire navire = getNavireById(id);

        if (!navire.getCodeNavire().equals(navireDetails.getCodeNavire()) &&
                navireRepository.existsByCodeNavire(navireDetails.getCodeNavire())) {
            throw new DuplicateResourceException("Un navire avec le code " + navireDetails.getCodeNavire() + " existe déjà");
        }

        navire.setCodeNavire(navireDetails.getCodeNavire());
        navire.setNomNavire(navireDetails.getNomNavire());

        return navireRepository.save(navire);
    }

    public void deleteNavire(Integer id) {
        Navire navire = getNavireById(id);
        navireRepository.delete(navire);
    }
}