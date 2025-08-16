package com.marsa_maroc.gestion_des_prestation.entities;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.marsa_maroc.gestion_des_prestation.enums.TypePesage;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pesages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pesage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pesage")
    private Integer idPesage;

    @ManyToOne
    @JoinColumn(name = "prestation_id")
    @JsonManagedReference
    private Prestation prestation;

    @ManyToOne
    @JoinColumn(name = "camion_id", nullable = false)
    private Camion camion;

    @Column(name = "date_pesage", nullable = false)
    private LocalDateTime datePesage;

    @Column(name = "poids", precision = 12, scale = 3)
    private BigDecimal poids;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_pesage", nullable = false)
    private TypePesage typePesage;

    @Column(name = "tarif", precision = 10, scale = 2)
    private BigDecimal tarif;

    @Column(name = "bon_sortie")
    private String bonSortie;
}