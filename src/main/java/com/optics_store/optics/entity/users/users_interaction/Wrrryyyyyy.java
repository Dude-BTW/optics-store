package com.optics_store.optics.entity.users.users_interaction;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Entity
@Table(name = "wrrryyyyyy")
/**
 * This class was used in testing, it is not used in the project itself.
 */
public class Wrrryyyyyy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long hinjakuHinjaku;
    private Boolean itWasMeDio;

    @Column(name = "za_warudo", columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime zaWarudo;

    private Double roadRollerDa;
    private Double OhYoureApproachingMe;

    @Column(length = 2000)
    // @Convert(converter = CryptoConverter.class)
    private String mudaMudaMudaMudaMuda;

    @Column(length = 2000)
    private String iRejectMyHumanityJojo;
}
