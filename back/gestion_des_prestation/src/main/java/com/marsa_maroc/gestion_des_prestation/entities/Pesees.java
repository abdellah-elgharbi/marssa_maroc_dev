package com.marsa_maroc.gestion_des_prestation.entities;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
@Entity
@Table(name = "historique_pesees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pesees {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historique_pesee")
    private Integer idHistoriquePesee;

    @ManyToOne
    @JoinColumn(name = "prestation_id")
    private Prestation prestation;

    @ManyToOne
    @JoinColumn(name = "camion_id")
    private Camion camion;

    @Column(name = "date_tare",nullable = true)
    private LocalDate dateTare;

    @Column(name = "heure_tare")
    private LocalTime heureTare;

    @Column(name = "date_brute",nullable = true)
    private LocalDate dateBrute;

    @Column(name = "heure_brute")
    private LocalTime heureBrute;


    @Column(name = "poids_brut", precision = 12, scale = 3)
    private BigDecimal poidsBrut = BigDecimal.ZERO;

    @Column(name = "poids_tare", precision = 12, scale = 3)
    private BigDecimal poidsTare = BigDecimal.ZERO;

    @Column(name = "poids_net", precision = 12, scale = 3)
    private BigDecimal poidsNet = BigDecimal.ZERO;

    @Column(name = "tarif", precision = 10, scale = 2)
    private BigDecimal tarif;

    @Column(name = "bon_sortie")
    private Boolean bonSortie;
}
