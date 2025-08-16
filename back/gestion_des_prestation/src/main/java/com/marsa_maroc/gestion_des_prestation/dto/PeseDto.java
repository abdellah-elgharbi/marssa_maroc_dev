package com.marsa_maroc.gestion_des_prestation.dto;

import com.marsa_maroc.gestion_des_prestation.entities.Camion;
import com.marsa_maroc.gestion_des_prestation.entities.Prestation;
import com.marsa_maroc.gestion_des_prestation.enums.TypePesage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PeseDto {
    private LocalTime heureMesure;
    private LocalDate dateMesure;
    private BigDecimal poisMesurer;
    private Prestation presation;
    private Camion camion;
    private TypePesage typePesage;
}
