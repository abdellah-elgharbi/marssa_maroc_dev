package com.marsa_maroc.gestion_des_prestation.service;


import com.marsa_maroc.gestion_des_prestation.entities.ListeCamionsAutorises;
import com.marsa_maroc.gestion_des_prestation.exeptions.DuplicateResourceException;
import com.marsa_maroc.gestion_des_prestation.exeptions.ResourceNotFoundException;
import com.marsa_maroc.gestion_des_prestation.respositories.ListeCamionsAutoriseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ListeCamionsAutoriseService {

    private final ListeCamionsAutoriseRepository listeCamionsAutoriseRepository;

    @Transactional(readOnly = true)
    public List<ListeCamionsAutorises> getAllCamionsAutorises() {
        return listeCamionsAutoriseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ListeCamionsAutorises getCamionAutoriseById(Integer id) {
        return listeCamionsAutoriseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Autorisation non trouvée avec l'ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<ListeCamionsAutorises> getCamionsAutorisesByPrestation(String numeroPrestation) {
        return listeCamionsAutoriseRepository.findByPrestationNumeroPrestation(numeroPrestation);
    }

    @Transactional(readOnly = true)
    public List<ListeCamionsAutorises> getCamionsAutorisesByCamion(String immatriculation) {
        return listeCamionsAutoriseRepository.findByCamionImmatriculation(immatriculation);
    }

    public ListeCamionsAutorises createCamionAutorise(ListeCamionsAutorises camionAutorise) throws DuplicateResourceException {
        // Vérifier si l'autorisation existe déjà
        if (listeCamionsAutoriseRepository.existsByPrestationNumeroPrestationAndCamionImmatriculation(
                camionAutorise.getPrestation().getNumeroPrestation(),
                camionAutorise.getCamion().getImmatriculation())) {
            throw new DuplicateResourceException("Ce camion est déjà autorisé pour cette prestation");
        }
        return listeCamionsAutoriseRepository.save(camionAutorise);
    }

    public ListeCamionsAutorises updateCamionAutorise(Integer id, ListeCamionsAutorises camionAutoriseDetails) {
        ListeCamionsAutorises camionAutorise = getCamionAutoriseById(id);
        camionAutorise.setPrestation(camionAutoriseDetails.getPrestation());
        camionAutorise.setCamion(camionAutoriseDetails.getCamion());
        return listeCamionsAutoriseRepository.save(camionAutorise);
    }

    public void deleteCamionAutorise(Integer id) {
        ListeCamionsAutorises camionAutorise = getCamionAutoriseById(id);
        listeCamionsAutoriseRepository.delete(camionAutorise);
    }

    @Transactional(readOnly = true)
    public boolean isCamionAutorised(String numeroPrestation, String immatriculation) {
        return listeCamionsAutoriseRepository.existsByPrestationNumeroPrestationAndCamionImmatriculation(
                numeroPrestation, immatriculation);
    }
}