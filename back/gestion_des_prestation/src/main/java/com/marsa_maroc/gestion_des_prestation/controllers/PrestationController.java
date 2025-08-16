package com.marsa_maroc.gestion_des_prestation.controllers;



import com.marsa_maroc.gestion_des_prestation.entities.Prestation;
import com.marsa_maroc.gestion_des_prestation.enums.Statut;
import com.marsa_maroc.gestion_des_prestation.enums.TypeOperation;
import com.marsa_maroc.gestion_des_prestation.service.PrestationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/prestations")
@RequiredArgsConstructor


public class PrestationController {

    private final PrestationService prestationService;

    @GetMapping
    public ResponseEntity<List<Prestation>> getAllPrestations() {
        List<Prestation> prestations = prestationService.getAllPrestations();
        return ResponseEntity.ok(prestations);
    }

//    @GetMapping("/with-details")
//    public ResponseEntity<List<Prestation>> getAllPrestationsWithDetails() {
//        List<Prestation> prestations = prestationService.getAllPrestationsWithDetails();
//        return ResponseEntity.ok(prestations);
//    }

    @GetMapping("/{numeroPrestation}")
    public ResponseEntity<Prestation> getPrestationById(@PathVariable String numeroPrestation) {
        Prestation prestation = prestationService.getPrestationById(numeroPrestation);
        return ResponseEntity.ok(prestation);
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Prestation>> getPrestationsByStatut(@PathVariable Statut statut) {
        List<Prestation> prestations = prestationService.getPrestationsByStatut(statut);
        return ResponseEntity.ok(prestations);
    }

    @GetMapping("/type-operation/{typeOperation}")
    public ResponseEntity<List<Prestation>> getPrestationsByTypeOperation(@PathVariable TypeOperation typeOperation) {
        List<Prestation> prestations = prestationService.getPrestationsByTypeOperation(typeOperation);
        return ResponseEntity.ok(prestations);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Prestation>> getPrestationsByClient(@PathVariable Integer clientId) {
        List<Prestation> prestations = prestationService.getPrestationsByClient(clientId);
        return ResponseEntity.ok(prestations);
    }

    @GetMapping("/navire/{navireId}")
    public ResponseEntity<List<Prestation>> getPrestationsByNavire(@PathVariable Integer navireId) {
        List<Prestation> prestations = prestationService.getPrestationsByNavire(navireId);
        return ResponseEntity.ok(prestations);
    }

    @GetMapping("/date-creation")
    public ResponseEntity<List<Prestation>> getPrestationsByDateCreation(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Prestation> prestations = prestationService.getPrestationsByDateCreation(startDate, endDate);
        return ResponseEntity.ok(prestations);
    }

    @GetMapping("/date-arrivee")
    public ResponseEntity<List<Prestation>> getPrestationsByDateArrivee(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Prestation> prestations = prestationService.getPrestationsByDateArrivee(startDate, endDate);
        return ResponseEntity.ok(prestations);
    }

    @PostMapping
    public ResponseEntity<Prestation> createPrestation(@Valid @RequestBody Prestation prestation) {
        System.out.println(prestation.toString());
        Prestation savedPrestation = prestationService.createPrestation(prestation);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPrestation);
    }

    @PutMapping("/{numeroPrestation}")
    public ResponseEntity<Prestation> updatePrestation(@PathVariable String numeroPrestation,
                                                       @Valid @RequestBody Prestation prestation) {
        Prestation updatedPrestation = prestationService.updatePrestation(numeroPrestation, prestation);
        return ResponseEntity.ok(updatedPrestation);
    }

    @DeleteMapping("/{numeroPrestation}")
    public ResponseEntity<Void> deletePrestation(@PathVariable String numeroPrestation) {
        prestationService.deletePrestation(numeroPrestation);
        return ResponseEntity.noContent().build();
    }
}