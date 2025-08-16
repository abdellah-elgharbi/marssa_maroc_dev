package com.marsa_maroc.gestion_des_prestation.service;


import com.marsa_maroc.gestion_des_prestation.entities.Camion;
import com.marsa_maroc.gestion_des_prestation.exeptions.ResourceNotFoundException;
import com.marsa_maroc.gestion_des_prestation.respositories.CamionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CamionService {

    private final CamionRepository camionRepository;

    @Transactional(readOnly = true)
    public List<Camion> getAllCamions() {
        return camionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Camion getCamionById(String immatriculation) {
        return camionRepository.findById(immatriculation)
                .orElseThrow(() -> new ResourceNotFoundException("Camion non trouvé avec l'immatriculation: " + immatriculation));
    }


    @Transactional(readOnly = true)
    public List<Camion> searchCamionsByTransporteurName(String nomTransporteur) {
        return camionRepository.findCamionsByTransporteurName(nomTransporteur);
    }

    public Camion createCamion(Camion camion) {
        return camionRepository.save(camion);
    }

    public Camion updateCamion(String immatriculation, Camion camionDetails) {
        Camion camion = getCamionById(immatriculation);
        camion.setTransporteur(camionDetails.getTransporteur());
        return camionRepository.save(camion);
    }

    public void deleteCamion(String immatriculation) {
        Camion camion = getCamionById(immatriculation);
        camionRepository.delete(camion);
    }
}