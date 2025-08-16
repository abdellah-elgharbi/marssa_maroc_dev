package com.marsa_maroc.gestion_des_prestation.controllers;


import com.marsa_maroc.gestion_des_prestation.entities.Navire;
import com.marsa_maroc.gestion_des_prestation.exeptions.DuplicateResourceException;
import com.marsa_maroc.gestion_des_prestation.service.NavireService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/navires")
@RequiredArgsConstructor

public class NavireController {

    private final NavireService navireService;

    @GetMapping
    public ResponseEntity<List<Navire>> getAllNavires() {
        List<Navire> navires = navireService.getAllNavires();
        return ResponseEntity.ok(navires);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Navire> getNavireById(@PathVariable Integer id) {
        Navire navire = navireService.getNavireById(id);
        return ResponseEntity.ok(navire);
    }

    @GetMapping("/code/{codeNavire}")
    public ResponseEntity<Navire> getNavireByCode(@PathVariable String codeNavire) {
        Navire navire = navireService.getNavireByCode(codeNavire);
        return ResponseEntity.ok(navire);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Navire>> searchNaviresByNom(@RequestParam String nomNavire) {
        List<Navire> navires = navireService.searchNaviresByNom(nomNavire);
        return ResponseEntity.ok(navires);
    }

    @PostMapping
    public ResponseEntity<Navire> createNavire(@Valid @RequestBody Navire navire) throws DuplicateResourceException {
        Navire savedNavire = navireService.createNavire(navire);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNavire);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Navire> updateNavire(@PathVariable Integer id, @Valid @RequestBody Navire navire) throws DuplicateResourceException {
        Navire updatedNavire = navireService.updateNavire(id, navire);
        return ResponseEntity.ok(updatedNavire);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNavire(@PathVariable Integer id) {
        navireService.deleteNavire(id);
        return ResponseEntity.noContent().build();
    }
}