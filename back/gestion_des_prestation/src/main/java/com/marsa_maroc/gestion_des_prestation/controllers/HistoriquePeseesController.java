package com.marsa_maroc.gestion_des_prestation.controllers;

import com.marsa_maroc.gestion_des_prestation.dto.PeseDto;
import com.marsa_maroc.gestion_des_prestation.entities.Pesees;
import com.marsa_maroc.gestion_des_prestation.exeptions.ResourceNotFoundException;
import com.marsa_maroc.gestion_des_prestation.mapper.mapper;
import com.marsa_maroc.gestion_des_prestation.service.HistoriquePeseesService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/historique-pesees")
@RequiredArgsConstructor

public class HistoriquePeseesController {

    private final HistoriquePeseesService historiquePeseesService;
    private final mapper m;
    /**
     * Récupérer tout l'historique des pesées
     */
    @GetMapping
    public ResponseEntity<List<Pesees>> getAllHistoriquePesees() {
        List<Pesees> historiquePesees = historiquePeseesService.getAllHistoriquePesees();
        return ResponseEntity.ok(historiquePesees);
    }

    /**
     * Récupérer un historique de pesée par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Pesees> getHistoriquePeseeById(@PathVariable Integer id) {
        try {
            Pesees historiquePesee = historiquePeseesService.getHistoriquePeseeById(id);
            return ResponseEntity.ok(historiquePesee);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Récupérer l'historique des pesées par numéro de prestation
     */
    @GetMapping("/prestation/{numeroPrestation}")
    public ResponseEntity<List<Pesees>> getHistoriquePeseesByPrestation(
            @PathVariable String numeroPrestation) {
        List<Pesees> historiquePesees =
                historiquePeseesService.getHistoriquePeseesByPrestation(numeroPrestation);
        return ResponseEntity.ok(historiquePesees);
    }

    /**
     * Récupérer l'historique des pesées par numéro de prestation (trié par date décroissante)
     */
    @GetMapping("/prestation/{numeroPrestation}/ordered")
    public ResponseEntity<List<Pesees>> getHistoriquePeseesByPrestationOrderByDate(
            @PathVariable String numeroPrestation) {
        List<Pesees> historiquePesees =
                historiquePeseesService.getHistoriquePeseesByPrestationOrderByDate(numeroPrestation);
        return ResponseEntity.ok(historiquePesees);
    }

    /**
     * Récupérer l'historique des pesées par immatriculation de camion
     */
    @GetMapping("/camion/{immatriculation}")
    public ResponseEntity<List<Pesees>> getHistoriquePeseesByCamion(
            @PathVariable String immatriculation) {
        List<Pesees> historiquePesees =
                historiquePeseesService.getHistoriquePeseesByCamion(immatriculation);
        return ResponseEntity.ok(historiquePesees);
    }

    /**
     * Récupérer l'historique des pesées par plage de dates
     * Format des dates : yyyy-MM-dd'T'HH:mm:ss
     * Exemple : /api/historique-pesees/date-range?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<Pesees>> getHistoriquePeseesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        List<Pesees> historiquePesees =
                historiquePeseesService.getHistoriquePeseesByDateRange(startDate, endDate);
        return ResponseEntity.ok(historiquePesees);
    }

    /**
     * Récupérer l'historique des pesées par plage de dates (version simplifiée avec dates seulement)
     * Format des dates : yyyy-MM-dd
     * Exemple : /api/historique-pesees/date-range-simple?startDate=2024-01-01&endDate=2024-12-31
     */
    @GetMapping("/date-range-simple")
    public ResponseEntity<List<Pesees>> getHistoriquePeseesByDateRangeSimple(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String endDate) {

        LocalDateTime startDateTime = LocalDateTime.parse(startDate + "T00:00:00");
        LocalDateTime endDateTime = LocalDateTime.parse(endDate + "T23:59:59");

        List<Pesees> historiquePesees =
                historiquePeseesService.getHistoriquePeseesByDateRange(startDateTime, endDateTime);
        return ResponseEntity.ok(historiquePesees);
    }

    /**
     * Créer un nouvel historique de pesée
     */
    @PostMapping
    public ResponseEntity<?> createHistoriquePesee(@Valid @RequestBody PeseDto historiquePesee) {
        try {
            Pesees pesess= m.fromPesseDtoToPesse(historiquePesee);
            System.out.println(pesess);
            Pesees nouvelHistorique =
                    historiquePeseesService.createHistoriquePesee(pesess);
            return ResponseEntity.status(HttpStatus.CREATED).body(nouvelHistorique);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Mettre à jour un historique de pesée existant
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateHistoriquePesee(
            @PathVariable Integer id,
            @Valid @RequestBody Pesees historiquePeseeDetails) {
        try {
            System.out.println(historiquePeseeDetails);
            Pesees historiquePeseeModifie =
                    historiquePeseesService.updateHistoriquePesee(id, historiquePeseeDetails);
            return ResponseEntity.ok(historiquePeseeModifie);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Erreur lors de la mise à jour de l'historique de pesée: " + e.getMessage()));
        }
    }

    /**
     * Supprimer un historique de pesée
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHistoriquePesee(@PathVariable Integer id) {
        try {
            historiquePeseesService.deleteHistoriquePesee(id);
            return ResponseEntity.ok(Map.of("suppretion", true));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la suppression de l'historique de pesée"));
        }
    }

    @GetMapping("/lastTre/{numeroPrestation}")
    public ResponseEntity<Pesees> getLastTare(@PathVariable String numeroPrestation){
            try{
                return ResponseEntity.ok(historiquePeseesService.getLastHistTare(numeroPrestation));
            }catch (Exception e){
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
    }

    /**
     * Obtenir des statistiques sur les pesées pour une prestation
     */
    @GetMapping("/prestation/{numeroPrestation}/stats")
    public ResponseEntity<Map<String, Object>> getStatistiquesPesees(@PathVariable String numeroPrestation) {
        try {
            List<Pesees> pesees = historiquePeseesService.getHistoriquePeseesByPrestation(numeroPrestation);

            if (pesees.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "Aucune pesée trouvée pour cette prestation"));
            }

            // Calcul des statistiques
            double totalPoidsNet = pesees.stream()
                    .mapToDouble(p -> p.getPoidsNet() != null ? p.getPoidsNet().doubleValue() : 0.0)
                    .sum();

            double moyennePoidsNet = pesees.stream()
                    .mapToDouble(p -> p.getPoidsNet() != null ? p.getPoidsNet().doubleValue() : 0.0)
                    .average()
                    .orElse(0.0);

            double totalTarif = pesees.stream()
                    .mapToDouble(p -> p.getTarif() != null ? p.getTarif().doubleValue() : 0.0)
                    .sum();

            Map<String, Object> stats = Map.of(
                    "nombrePesees", pesees.size(),
                    "totalPoidsNet", totalPoidsNet,
                    "moyennePoidsNet", moyennePoidsNet,
                    "totalTarif", totalTarif,
                    "premiereDate", pesees.get(pesees.size() - 1).getDateTare(),
                    "derniereDate", pesees.get(0).getDateTare()
            );

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors du calcul des statistiques"));
        }
    }

    /**
     * Gestionnaire d'exception pour ResourceNotFoundException
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFoundException(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
    }

    /**
     * Gestionnaire d'exception générique
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Une erreur interne s'est produite: " + e.getMessage()));
    }
}