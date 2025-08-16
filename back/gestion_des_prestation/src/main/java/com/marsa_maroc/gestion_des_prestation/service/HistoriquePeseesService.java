package com.marsa_maroc.gestion_des_prestation.service;


import com.marsa_maroc.gestion_des_prestation.entities.Camion;
import com.marsa_maroc.gestion_des_prestation.entities.Pesees;
import com.marsa_maroc.gestion_des_prestation.entities.Prestation;
import com.marsa_maroc.gestion_des_prestation.enums.Statut;
import com.marsa_maroc.gestion_des_prestation.exeptions.ResourceNotFoundException;
import com.marsa_maroc.gestion_des_prestation.respositories.HistoriquePeseesRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
@Transactional
public class HistoriquePeseesService {

    private final HistoriquePeseesRepository historiquePeseesRepository;
    private  final  CamionService camionService;
    private final PrestationService prestationService;
    public Pesees getLastHistTare(String numeroDePrestation){
        System.out.println("gggg");
        return historiquePeseesRepository.findFirstByDateBruteAndPrestationNumeroPrestationOrderByIdHistoriquePeseeDesc(null,numeroDePrestation);
    }
    @Transactional(readOnly = true)
    public List<Pesees> getAllHistoriquePesees() {
        return historiquePeseesRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Pesees getHistoriquePeseeById(Integer id) {
        return historiquePeseesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Historique pesée non trouvé avec l'ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Pesees> getHistoriquePeseesByPrestation(String numeroPrestation) {
        return historiquePeseesRepository.findByPrestationNumeroPrestation(numeroPrestation);
    }

    @Transactional(readOnly = true)
    public List<Pesees> getHistoriquePeseesByCamion(String immatriculation) {
        return historiquePeseesRepository.findByCamionImmatriculation(immatriculation);
    }
    @Transactional(readOnly = true)
    public Pesees getHistoriquePeseesByCamionLastOne(String immatriculation,String numeroPrestation) {
        return historiquePeseesRepository.findFirstByCamionImmatriculationAndPrestationNumeroPrestationOrderByIdHistoriquePeseeDesc(immatriculation,numeroPrestation);
    }


    @Transactional(readOnly = true)
    public List<Pesees> getHistoriquePeseesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return historiquePeseesRepository.findByDateTareBetween(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<Pesees> getHistoriquePeseesByPrestationOrderByDate(String numeroPrestation) {
        return historiquePeseesRepository.findByPrestationOrderByDateTareDesc(numeroPrestation);
    }

    public Pesees createHistoriquePesee(Pesees historiquePesee) {
        camionService.createCamion(new Camion(historiquePesee.getCamion().getImmatriculation(),historiquePesee.getCamion().getTransporteur()));
        return historiquePeseesRepository.save(historiquePesee);
    }
    public Pesees updateHistoriquePesee(Integer id, Pesees historiquePeseeDetails) {
        // Récupération de l'historique existant
        Pesees historiquePesee = getHistoriquePeseeById(id);

        // Création du camion si nécessaire
        camionService.createCamion(new Camion(
                historiquePeseeDetails.getCamion().getImmatriculation(),
                historiquePeseeDetails.getCamion().getTransporteur()
        ));

        // Stockage de l'ancien poids net pour ajustement
        BigDecimal ancienPoidsNet = historiquePesee.getPoidsNet();
        System.out.println(historiquePeseeDetails);
        // Mise à jour des champs de l'historique
        historiquePesee.setPrestation(historiquePeseeDetails.getPrestation());
        historiquePesee.setCamion(historiquePeseeDetails.getCamion());
        if(historiquePeseeDetails.getDateTare()!=null && historiquePeseeDetails.getHeureTare()!=null) {
        	  historiquePesee.setDateTare(historiquePeseeDetails.getDateTare());
              historiquePesee.setHeureTare(historiquePeseeDetails.getHeureTare());
        }
        if(historiquePeseeDetails.getHeureBrute()!=null && historiquePeseeDetails.getDateBrute()!=null) {
      	  historiquePesee.setDateTare(historiquePeseeDetails.getDateBrute());
            historiquePesee.setHeureTare(historiquePeseeDetails.getHeureBrute());
      }
      
        historiquePesee.setTarif(historiquePeseeDetails.getTarif());
        historiquePesee.setBonSortie(historiquePeseeDetails.getBonSortie());
        
        // Vérification si poids brut et tare sont non nuls
        BigDecimal poidsBrut = historiquePeseeDetails.getPoidsBrut();
        BigDecimal poidsTare = historiquePeseeDetails.getPoidsTare();
        historiquePesee.setPoidsTare(poidsTare);
        historiquePesee.setPoidsBrut(poidsBrut);
        System.out.println(poidsTare);
        System.out.println(poidsBrut);
        BigDecimal nouveauPoidsNet = ancienPoidsNet; // Par défaut, reste inchangé

        if (poidsBrut != null && poidsTare != null && 
            poidsBrut.compareTo(BigDecimal.ZERO) != 0 && 
            poidsTare.compareTo(BigDecimal.ZERO) != 0) {

            // Mettre à jour les poids seulement si les deux sont renseignés
            historiquePesee.setPoidsBrut(poidsBrut);
            historiquePesee.setPoidsTare(poidsTare);

            // Recalcul du poids net
            nouveauPoidsNet = poidsBrut.subtract(poidsTare);
            historiquePesee.setPoidsNet(nouveauPoidsNet);
            historiquePesee.setBonSortie(true);
        }

        // Récupération de la prestation liée
        Prestation prestation = prestationService.getPrestationById(historiquePeseeDetails.getPrestation().getNumeroPrestation());

        // Calcul du poids restant exact
        BigDecimal poisRestent = prestation.getPoisRestent().add(ancienPoidsNet).subtract(nouveauPoidsNet);

        // Mise à jour du statut et du poids restant
        if (poisRestent.compareTo(BigDecimal.ZERO) > 0) {
            prestation.setPoisRestent(poisRestent);
        } else {
            prestation.setPoisRestent(BigDecimal.ZERO);
            prestation.setStatut(Statut.TERMINE);
        }

        // Mise à jour de la prestation
        prestationService.updatePrestation(prestation.getNumeroPrestation(), prestation);
        historiquePesee.setPrestation(prestation);
        
        // Sauvegarde finale de l'historique
        return historiquePeseesRepository.save(historiquePesee);
    }


    public void deleteHistoriquePesee(Integer id) {
        Pesees historiquePesee = getHistoriquePeseeById(id);
        Prestation prestation = historiquePesee.getPrestation();
        prestation.setPoisRestent(prestation.getPoisRestent().add(historiquePesee.getPoidsNet()));
        prestation.setStatut(Statut.EN_EXECUTION);
        prestationService.updatePrestation(prestation.getNumeroPrestation(),prestation);
        historiquePeseesRepository.delete(historiquePesee);
    }
}