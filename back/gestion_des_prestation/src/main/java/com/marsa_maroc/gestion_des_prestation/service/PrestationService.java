package com.marsa_maroc.gestion_des_prestation.service;


import com.marsa_maroc.gestion_des_prestation.entities.Prestation;
import com.marsa_maroc.gestion_des_prestation.enums.Statut;
import com.marsa_maroc.gestion_des_prestation.enums.TypeOperation;
import com.marsa_maroc.gestion_des_prestation.exeptions.ResourceNotFoundException;
import com.marsa_maroc.gestion_des_prestation.respositories.HistoriquePeseesRepository;
import com.marsa_maroc.gestion_des_prestation.respositories.PrestationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PrestationService {

    private final PrestationRepository prestationRepository;
    private final HistoriquePeseesRepository historiquePeseesRepository;
    @Transactional(readOnly = true)
    public List<Prestation> getAllPrestations() {
        return prestationRepository.findAll();
    }

//    @Transactional(readOnly = true)
//    public List<Prestation> getAllPrestationsWithDetails() {
//        return prestationRepository.findAllWithclientAndnavire();
//    }

    @Transactional(readOnly = true)
    public Prestation getPrestationById(String numeroPrestation) {
        return prestationRepository.findById(numeroPrestation)
                .orElseThrow(() -> new ResourceNotFoundException("Prestation non trouvée avec le numéro: " + numeroPrestation));
    }

    @Transactional(readOnly = true)
    public List<Prestation> getPrestationsByStatut(Statut statut) {
        return prestationRepository.findByStatut(statut);
    }

    @Transactional(readOnly = true)
    public List<Prestation> getPrestationsByTypeOperation(TypeOperation typeOperation) {
        return prestationRepository.findByTypeOperation(typeOperation);
    }

    @Transactional(readOnly = true)
    public List<Prestation> getPrestationsByClient(Integer clientId) {
        return prestationRepository.findByClientIdClient(clientId);
    }

    @Transactional(readOnly = true)
    public List<Prestation> getPrestationsByNavire(Integer navireId) {
        return prestationRepository.findByNavireIdNavire(navireId);
    }

    @Transactional(readOnly = true)
    public List<Prestation> getPrestationsByDateCreation(LocalDate startDate, LocalDate endDate) {
        return prestationRepository.findByDateCreationBetween(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<Prestation> getPrestationsByDateArrivee(LocalDate startDate, LocalDate endDate) {
        return prestationRepository.findByDateArriveeBetween(startDate, endDate);
    }

    public Prestation createPrestation(Prestation prestation) {
        System.out.println(prestation);
        return prestationRepository.save(prestation);
    }

    public Prestation updatePrestation(String numeroPrestation, Prestation prestationDetails) {
        Prestation prestation = getPrestationById(numeroPrestation);

        prestation.setDateCreation(prestationDetails.getDateCreation());
        prestation.setClient(prestationDetails.getClient());
        prestation.setNavire(prestationDetails.getNavire());
        prestation.setStatut(prestationDetails.getStatut());
        prestation.setTypeOperation(prestationDetails.getTypeOperation());
        prestation.setPoidsDeclare(prestationDetails.getPoidsDeclare());
        prestation.setDateArrivee(prestationDetails.getDateArrivee());
        prestation.setDateDepart(prestationDetails.getDateDepart());
        prestation.setBulletinPrestation(prestationDetails.getBulletinPrestation());
        prestation.setTypeMarchandise(prestationDetails.getTypeMarchandise());
        prestation.setConnaissement(prestationDetails.getConnaissement());

        return prestationRepository.save(prestation);
    }

    public void deletePrestation(String numeroPrestation) {
        int deletedCount = historiquePeseesRepository.deleteByPrestationNumeroPrestation(numeroPrestation);
        System.out.println(deletedCount + " pesées supprimées.");

        Prestation prestation = getPrestationById(numeroPrestation);
        if (prestation == null) {
            throw new IllegalArgumentException("Prestation avec le numéro " + numeroPrestation + " introuvable.");
        }

        prestationRepository.delete(prestation);
    }


}