package com.marsa_maroc.gestion_des_prestation.controllers;

import com.marsa_maroc.gestion_des_prestation.entities.Camion;
import com.marsa_maroc.gestion_des_prestation.service.CamionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/camions")
@RequiredArgsConstructor

public class CamionController {

    private final CamionService camionService;

    @GetMapping
    public ResponseEntity<List<Camion>> getAllCamions() {
        List<Camion> camions = camionService.getAllCamions();
        return ResponseEntity.ok(camions);
    }

    @GetMapping("/{immatriculation}")
    public ResponseEntity<Camion> getCamionById(@PathVariable String immatriculation) {
        Camion camion = camionService.getCamionById(immatriculation);
        return ResponseEntity.ok(camion);
    }



    @GetMapping("/search")
    public ResponseEntity<List<Camion>> searchCamionsByTransporteurName(@RequestParam String nomTransporteur) {
        List<Camion> camions = camionService.searchCamionsByTransporteurName(nomTransporteur);
        return ResponseEntity.ok(camions);
    }

    @PostMapping
    public ResponseEntity<Camion> createCamion(@Valid @RequestBody Camion camion) {
        System.out.println(camion.toString());

        Camion savedCamion = camionService.createCamion(camion);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCamion);
    }

    @PutMapping("/{immatriculation}")
    public ResponseEntity<Camion> updateCamion(@PathVariable String immatriculation, @Valid @RequestBody Camion camion) {
        Camion updatedCamion = camionService.updateCamion(immatriculation, camion);
        return ResponseEntity.ok(updatedCamion);
    }

    @DeleteMapping("/{immatriculation}")
    public ResponseEntity<Void> deleteCamion(@PathVariable String immatriculation) {
        camionService.deleteCamion(immatriculation);
        return ResponseEntity.noContent().build();
    }
}
