package com.marsa_maroc.gestion_des_prestation.service;

import com.marsa_maroc.gestion_des_prestation.entities.Pesage;
import com.marsa_maroc.gestion_des_prestation.enums.TypePesage;
import com.marsa_maroc.gestion_des_prestation.exeptions.ResourceNotFoundException;
import com.marsa_maroc.gestion_des_prestation.respositories.PesageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PesageService {

    private final PesageRepository pesageRepository;

    @Transactional(readOnly = true)
    public List<Pesage> getAllPesages() {
        return pesageRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Pesage getPesageById(Integer id) {
        return pesageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pesage non trouvé avec l'ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Pesage> getPesagesByPrestation(String numeroPrestation) {
        return pesageRepository.findByPrestationNumeroPrestation(numeroPrestation);
    }

    @Transactional(readOnly = true)
    public List<Pesage> getPesagesByCamion(String immatriculation) {
        return pesageRepository.findByCamionImmatriculation(immatriculation);
    }

    @Transactional(readOnly = true)
    public List<Pesage> getPesagesByType(TypePesage typePesage) {
        return pesageRepository.findByTypePesage(typePesage);
    }

    @Transactional(readOnly = true)
    public List<Pesage> getPesagesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return pesageRepository.findByDatePesageBetween(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<Pesage> getPesagesByPrestationAndType(String numeroPrestation, TypePesage typePesage) {
        return pesageRepository.findByPrestationAndTypePesage(numeroPrestation, typePesage);
    }

    public Pesage createPesage(Pesage pesage) {

        return pesageRepository.save(pesage);
    }

    public Pesage updatePesage(Integer id, Pesage pesageDetails) {
        Pesage pesage = getPesageById(id);

        pesage.setPrestation(pesageDetails.getPrestation());
        pesage.setCamion(pesageDetails.getCamion());
        pesage.setDatePesage(pesageDetails.getDatePesage());
        pesage.setPoids(pesageDetails.getPoids());
        pesage.setTypePesage(pesageDetails.getTypePesage());
        pesage.setTarif(pesageDetails.getTarif());
        pesage.setBonSortie(pesageDetails.getBonSortie());

        return pesageRepository.save(pesage);
    }

    public void deletePesage(Integer id) {
        Pesage pesage = getPesageById(id);
        pesageRepository.delete(pesage);
    }
}
