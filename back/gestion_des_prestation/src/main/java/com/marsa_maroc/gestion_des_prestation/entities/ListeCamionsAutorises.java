package com.marsa_maroc.gestion_des_prestation.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "liste_camions_autorises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListeCamionsAutorises {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_liste_camion_autorise")
    private Integer idListeCamionAutorise;

    @ManyToOne
    @JoinColumn(name = "prestation_id", nullable = false)
    private Prestation prestation;

    @ManyToOne
    @JoinColumn(name = "camion_immatriculation", nullable = false)
    private Camion camion;
}