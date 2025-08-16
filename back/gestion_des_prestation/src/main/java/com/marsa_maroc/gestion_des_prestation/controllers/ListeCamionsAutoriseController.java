package com.marsa_maroc.gestion_des_prestation.controllers;

import com.marsa_maroc.gestion_des_prestation.entities.ListeCamionsAutorises;
import com.marsa_maroc.gestion_des_prestation.exeptions.DuplicateResourceException;
import com.marsa_maroc.gestion_des_prestation.exeptions.ResourceNotFoundException;
import com.marsa_maroc.gestion_des_prestation.service.ListeCamionsAutoriseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/camions-autorises")
@RequiredArgsConstructor

public class ListeCamionsAutoriseController {

    private final ListeCamionsAutoriseService listeCamionsAutoriseService;

    /**
     * Récupérer tous les camions autorisés
     */
    @GetMapping
    public ResponseEntity<List<ListeCamionsAutorises>> getAllCamionsAutorises() {
        List<ListeCamionsAutorises> camionsAutorises = listeCamionsAutoriseService.getAllCamionsAutorises();
        return ResponseEntity.ok(camionsAutorises);
    }

    /**
     * Récupérer un camion autorisé par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ListeCamionsAutorises> getCamionAutoriseById(@PathVariable Integer id) {
        try {
            ListeCamionsAutorises camionAutorise = listeCamionsAutoriseService.getCamionAutoriseById(id);
            return ResponseEntity.ok(camionAutorise);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Récupérer les camions autorisés par numéro de prestation
     */
    @GetMapping("/prestation/{numeroPrestation}")
    public ResponseEntity<List<ListeCamionsAutorises>> getCamionsAutorisesByPrestation(
            @PathVariable String numeroPrestation) {
        List<ListeCamionsAutorises> camionsAutorises =
                listeCamionsAutoriseService.getCamionsAutorisesByPrestation(numeroPrestation);
        return ResponseEntity.ok(camionsAutorises);
    }

    /**
     * Récupérer les camions autorisés par immatriculation de camion
     */
    @GetMapping("/camion/{immatriculation}")
    public ResponseEntity<List<ListeCamionsAutorises>> getCamionsAutorisesByCamion(
            @PathVariable String immatriculation) {
        List<ListeCamionsAutorises> camionsAutorises =
                listeCamionsAutoriseService.getCamionsAutorisesByCamion(immatriculation);
        return ResponseEntity.ok(camionsAutorises);
    }

    /**
     * Créer une nouvelle autorisation de camion
     */
    @PostMapping
    public ResponseEntity<?> createCamionAutorise(@Valid @RequestBody ListeCamionsAutorises camionAutorise) {
        try {
            ListeCamionsAutorises nouvelleAutorisation =
                    listeCamionsAutoriseService.createCamionAutorise(camionAutorise);
            return ResponseEntity.status(HttpStatus.CREATED).body(nouvelleAutorisation);
        } catch (DuplicateResourceException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Erreur lors de la création de l'autorisation"));
        }
    }

    /**
     * Mettre à jour une autorisation de camion existante
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCamionAutorise(
            @PathVariable Integer id,
            @Valid @RequestBody ListeCamionsAutorises camionAutoriseDetails) {
        try {
            ListeCamionsAutorises camionAutoriseModifie =
                    listeCamionsAutoriseService.updateCamionAutorise(id, camionAutoriseDetails);
            return ResponseEntity.ok(camionAutoriseModifie);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Erreur lors de la mise à jour de l'autorisation"));
        }
    }

    /**
     * Supprimer une autorisation de camion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCamionAutorise(@PathVariable Integer id) {
        try {
            listeCamionsAutoriseService.deleteCamionAutorise(id);
            return ResponseEntity.ok(Map.of("message", "Autorisation supprimée avec succès"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la suppression de l'autorisation"));
        }
    }

    /**
     * Vérifier si un camion est autorisé pour une prestation
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> isCamionAutorised(
            @RequestParam String numeroPrestation,
            @RequestParam String immatriculation) {
        boolean isAutorised = listeCamionsAutoriseService.isCamionAutorised(numeroPrestation, immatriculation);
        return ResponseEntity.ok(Map.of("autorise", isAutorised));
    }

    /**
     * Endpoint alternatif pour vérifier l'autorisation avec path variables
     */
    @GetMapping("/check/{numeroPrestation}/{immatriculation}")
    public ResponseEntity<Map<String, Boolean>> isCamionAutorisedPath(
            @PathVariable String numeroPrestation,
            @PathVariable String immatriculation) {
        boolean isAutorised = listeCamionsAutoriseService.isCamionAutorised(numeroPrestation, immatriculation);
        return ResponseEntity.ok(Map.of("autorise", isAutorised));
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
     * Gestionnaire d'exception pour DuplicateResourceException
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateResourceException(DuplicateResourceException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
    }

    /**
     * Gestionnaire d'exception générique
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Une erreur interne s'est produite"));
    }
}