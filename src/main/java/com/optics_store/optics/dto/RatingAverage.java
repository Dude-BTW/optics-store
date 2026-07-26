package com.optics_store.optics.dto;

import com.optics_store.optics.entity.Optics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
/**
 * Data Transfer Object (DTO).
 * Acts as a secure data container for transferring information between the
 * Front-end and Back-end.
 * Ensures that sensitive internal database structures are not directly exposed
 * to the client side.
 */
public class RatingAverage {

    private Optics optic;
    private Double averageStar;
    private Long numberOpticIds;
}
