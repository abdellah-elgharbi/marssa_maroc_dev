package com.marsa_maroc.gestion_des_prestation.controllers;


import com.marsa_maroc.gestion_des_prestation.entities.Pesage;
import com.marsa_maroc.gestion_des_prestation.entities.Prestation;
import com.marsa_maroc.gestion_des_prestation.enums.TypePesage;
import com.marsa_maroc.gestion_des_prestation.service.PesageService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pesages")
@RequiredArgsConstructor

public class PesageController {

    private final PesageService pesageService;

    @GetMapping
    public ResponseEntity<List<Pesage>> getAllPesages() {
        List<Pesage> pesages = pesageService.getAllPesages();
        return ResponseEntity.ok(pesages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pesage> getPesageById(@PathVariable Integer id) {
        Pesage pesage = pesageService.getPesageById(id);
        return ResponseEntity.ok(pesage);
    }

    @GetMapping("/prestation/{numeroPrestation}")
    public ResponseEntity<List<Pesage>> getPesagesByPrestation(@PathVariable String numeroPrestation) {
        List<Pesage> pesages = pesageService.getPesagesByPrestation(numeroPrestation);
        return ResponseEntity.ok(pesages);
    }

    @GetMapping("/camion/{immatriculation}")
    public ResponseEntity<List<Pesage>> getPesagesByCamion(@PathVariable String immatriculation) {
        List<Pesage> pesages = pesageService.getPesagesByCamion(immatriculation);
        return ResponseEntity.ok(pesages);
    }

    @GetMapping("/type/{typePesage}")
    public ResponseEntity<List<Pesage>> getPesagesByType(@PathVariable TypePesage typePesage) {
        List<Pesage> pesages = pesageService.getPesagesByType(typePesage);
        return ResponseEntity.ok(pesages);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Pesage>> getPesagesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Pesage> pesages = pesageService.getPesagesByDateRange(startDate, endDate);
        return ResponseEntity.ok(pesages);
    }

    @GetMapping("/prestation/{numeroPrestation}/type/{typePesage}")
    public ResponseEntity<List<Pesage>> getPesagesByPrestationAndType(
            @PathVariable String numeroPrestation,
            @PathVariable TypePesage typePesage) {
        List<Pesage> pesages = pesageService.getPesagesByPrestationAndType(numeroPrestation, typePesage);
        return ResponseEntity.ok(pesages);
    }

    @PostMapping
    public ResponseEntity<Pesage> createPesage(@Valid @RequestBody Pesage pesage) {
        Pesage savedPesage = pesageService.createPesage(pesage);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPesage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pesage> updatePesage(@PathVariable Integer id, @Valid @RequestBody Pesage pesage) {
        Pesage updatedPesage = pesageService.updatePesage(id, pesage);
        return ResponseEntity.ok(updatedPesage);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePesage(@PathVariable Integer id) {
        pesageService.deletePesage(id);
        return ResponseEntity.noContent().build();
    }

}
