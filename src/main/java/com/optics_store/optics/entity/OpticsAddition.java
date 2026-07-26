package com.optics_store.optics.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
@Entity
@Table(name = "optics_addition")
/**
 * Extended attributes for catalog products (Optics).
 * Contains detailed configurations (color, shape, dimensions) that trigger
 * dynamic interface state changes
 * on the Product Details Page (e.g., updating images, price, and cart
 * availability).
 */
public class OpticsAddition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "optic_id", nullable = false, unique = true)
    private Optics optic;

    // Main
    private Boolean top;
    private Double action;
    private Double quantity;
    private String fullPathImage1;
    private String fullPathImage2;

    // Mini Image
    private String fullPathMiniImage1;
    private String fullPathMiniImage2;

    // Color
    private String colorName1;
    private String color1;
    private String colorName2;
    private String color2;

    // Addition
    private String frameShape;
    private String faceShape;
    private String frameType;
    private String eyepieceSize;
    private String earringSize;
    private String bridgeSize;
    private String photochrome;
    private String collection;
    private String properties;
    private String clipOn;

    // Description
    private String opticDescription;

    // Excel Changes
    private Boolean excelChanges;
}
