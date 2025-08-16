package com.marsa_maroc.gestion_des_prestation.mapper;

import com.marsa_maroc.gestion_des_prestation.dto.PeseDto;
import com.marsa_maroc.gestion_des_prestation.entities.Pesees;
import com.marsa_maroc.gestion_des_prestation.entities.Prestation;
import com.marsa_maroc.gestion_des_prestation.enums.Statut;
import com.marsa_maroc.gestion_des_prestation.enums.TypeOperation;
import com.marsa_maroc.gestion_des_prestation.enums.TypePesage;
import com.marsa_maroc.gestion_des_prestation.service.HistoriquePeseesService;
import com.marsa_maroc.gestion_des_prestation.service.PrestationService;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class mapper {

    private final HistoriquePeseesService historiquePeseesService;
    private final PrestationService prestationService;

    public mapper(HistoriquePeseesService historiquePeseesService, PrestationService prestationService) {
        this.historiquePeseesService = historiquePeseesService;
        this.prestationService = prestationService;
    }

    public Pesees fromPesseDtoToPesse(PeseDto peseDto) {
        System.out.println("********************************************************************************************************************");
        System.out.println(peseDto);
        System.out.println("********************************************************************************************************************");
        if (peseDto == null) {
            throw new IllegalArgumentException("El ne peux pas etre null");
        }

        // Validation des champs obligatoires
        if (peseDto.getCamion() == null) {
            throw new IllegalArgumentException("Camion ne peut pas être null");
        }
        if (peseDto.getPresation() == null) {
            throw new IllegalArgumentException("Prestation ne peut pas être null");
        }

        Pesees pesees = new Pesees();
        pesees.setCamion(peseDto.getCamion());
        pesees.setPrestation(peseDto.getPresation());

        Prestation prestation = prestationService.getPrestationById(peseDto.getPresation().getNumeroPrestation());

        if (prestation == null) {
            throw new IllegalArgumentException("Prestation non trouvée");
        }

        if (prestation.getTypeOperation().equals(TypeOperation.IMPORT)) {

            if (TypePesage.TARE.equals(peseDto.getTypePesage())) {
                pesees.setDateTare(peseDto.getDateMesure());
                pesees.setPoidsTare(peseDto.getPoisMesurer());
                pesees.setHeureTare(peseDto.getHeureMesure());

            } else if (TypePesage.BRUT.equals(peseDto.getTypePesage())) {
                Pesees existingPeses = historiquePeseesService.getHistoriquePeseesByCamionLastOne(
                        peseDto.getCamion().getImmatriculation(),
                        peseDto.getPresation().getNumeroPrestation()
                );

                if (existingPeses != null) {
                    // Copy TARE data from existing record
                    pesees.setDateTare(existingPeses.getDateTare());
                    pesees.setPoidsTare(existingPeses.getPoidsTare());
                    pesees.setHeureTare(existingPeses.getHeureTare());
                    pesees.setIdHistoriquePesee(existingPeses.getIdHistoriquePesee());


                    pesees.setDateBrute(peseDto.getDateMesure());
                    pesees.setPoidsBrut(peseDto.getPoisMesurer());
                    pesees.setHeureBrute(peseDto.getHeureMesure());

                    if (pesees.getPoidsTare() != null) {
                        pesees.setPoidsNet(pesees.getPoidsBrut().subtract(pesees.getPoidsTare()));

                    }
                    System.out.println(prestation.getPoidsDeclare());
                    System.out.println(pesees.getPoidsNet());
                    BigDecimal poidsRestant = prestation.getPoisRestent().subtract(pesees.getPoidsNet());
                    System.out.println(poidsRestant);
                    System.out.println(poidsRestant.compareTo(BigDecimal.ZERO));
                    System.out.println("********************************************************************************************************************");
                    System.out.println("1");
                    System.out.println("********************************************************************************************************************");
                    // Vérification si poidsRestant est null (normalement impossible avec subtract)
                    if (poidsRestant == null) {
                        throw new IllegalStateException("Erreur de calcul : poids restant est null");
                    }

                    // ✅ LOGIQUE CORRECTE - Seulement 2 conditions
                    if (poidsRestant.compareTo(BigDecimal.ZERO) > 0) {
                        // Il reste encore du poids à traiter
                        prestation.setPoisRestent(poidsRestant);
                        System.out.println("********************************************************************************************************************");
                        System.out.println("ok");
                        System.out.println("********************************************************************************************************************");
                    } else {
                        System.out.println("********************************************************************************************************************");
                        System.out.println("ok I am here");
                        System.out.println("********************************************************************************************************************");

                        prestation.setStatut(Statut.TERMINE);
                        prestation.setPoisRestent(BigDecimal.ZERO);

                        // Optionnel: avertissement si dépassement
                        if (poidsRestant.compareTo(BigDecimal.ZERO) < 0) {
                            System.out.println("Attention: Poids traité dépasse le poids déclaré de " +
                                    poidsRestant.abs() + " unités");
                        }


                    }
                    pesees.setPrestation(prestation);
                    pesees.setBonSortie(true);
                }else{
                    throw new IllegalStateException("Poids déclaré de la prestation est null");
                }
            }

        } else {
            // TypeOperation.EXPORT

            if (TypePesage.BRUT.equals(peseDto.getTypePesage())) {
                pesees.setDateBrute(peseDto.getDateMesure());
                pesees.setPoidsBrut(peseDto.getPoisMesurer());
                pesees.setHeureBrute(peseDto.getHeureMesure());

            } else if (TypePesage.TARE.equals(peseDto.getTypePesage())) {
                Pesees existingPeses = historiquePeseesService.getHistoriquePeseesByCamionLastOne(
                        peseDto.getCamion().getImmatriculation(),
                        peseDto.getPresation().getNumeroPrestation()
                );
               System.out.println(existingPeses.toString());
                if (existingPeses != null) {
                    // Copy BRUT data from existing record
                    pesees.setDateBrute(existingPeses.getDateBrute());
                    pesees.setPoidsBrut(existingPeses.getPoidsBrut());
                    pesees.setHeureBrute(existingPeses.getHeureBrute());
                    pesees.setIdHistoriquePesee(existingPeses.getIdHistoriquePesee());


                    pesees.setDateTare(peseDto.getDateMesure());
                    pesees.setPoidsTare(peseDto.getPoisMesurer());
                    pesees.setHeureTare(peseDto.getHeureMesure());

                    if (pesees.getPoidsTare() != null && pesees.getPoidsBrut() != null) {
                        pesees.setPoidsNet(pesees.getPoidsBrut().subtract(pesees.getPoidsTare()));

                        // Vérification si getPoidsDeclare() retourne null
                        if (prestation.getPoidsDeclare() == null) {
                            throw new IllegalStateException("Poids déclaré de la prestation est null");
                        }

                        BigDecimal poidsRestant = prestation.getPoisRestent().subtract(pesees.getPoidsNet());
                        System.out.println("********************************************************************************************************************");
                        System.out.println("1");
                        System.out.println("********************************************************************************************************************");
                        // Vérification si poidsRestant est null (normalement impossible avec subtract)
                        if (poidsRestant == null) {
                            throw new IllegalStateException("Erreur de calcul : poids restant est null");
                        }

                        // ✅ LOGIQUE CORRECTE - Seulement 2 conditions
                        if (poidsRestant.compareTo(BigDecimal.ZERO) > 0) {
                            // Il reste encore du poids à traiter
                            prestation.setPoisRestent(poidsRestant);
                            System.out.println("********************************************************************************************************************");
                            System.out.println("ok");
                            System.out.println("********************************************************************************************************************");
                        } else {
                            System.out.println("********************************************************************************************************************");
                            System.out.println("ok I am here");
                            System.out.println("********************************************************************************************************************");

                            prestation.setStatut(Statut.TERMINE);
                            prestation.setPoisRestent(BigDecimal.ZERO);

                            // Optionnel: avertissement si dépassement
                            if (poidsRestant.compareTo(BigDecimal.ZERO) < 0) {
                                System.out.println("Attention: Poids traité dépasse le poids déclaré de " +
                                        poidsRestant.abs() + " unités");
                            }
                        }
                    }

                    pesees.setPrestation(prestation);
                    pesees.setBonSortie(true);
                }else{
                    throw new IllegalStateException("Poids déclaré de la prestation est null");
                }
            }
        }

        return pesees;
    }
}