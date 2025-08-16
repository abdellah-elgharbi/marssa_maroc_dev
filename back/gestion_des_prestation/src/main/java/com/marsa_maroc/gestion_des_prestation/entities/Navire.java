package com.marsa_maroc.gestion_des_prestation.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.concurrent.ThreadLocalRandom;

@Entity
@Table(name = "navires")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Navire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_navire")
    private Integer idNavire;

    @Column(name = "code_navire", unique = true, nullable = false)
    private String codeNavire="NVA"+ LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyyyyHHmmss"));

    @Column(name = "nom_navire", nullable = false)
    private String nomNavire;
}
