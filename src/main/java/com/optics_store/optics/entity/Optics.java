package com.optics_store.optics.entity;

import java.util.List;

import com.optics_store.optics.entity.users.users_interaction.QuestionAnswer;
import com.optics_store.optics.entity.users.users_interaction.Rating;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name = "optics")
/**
 * Core product entity for the e-commerce catalog.
 * Stores primary specifications (brand, category, price) used by the dynamic
 * filtering and search systems.
 * Connects to the UI components described in the architecture: product cards,
 * search, and categorization.
 */
public class Optics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String shortName;
    private String brand;
    private String manufacturer;
    private String category;
    private String gender;
    private String country;
    private String material;
    private String eyeglass;
    private String polarization;
    private Double groupPrice;
    private Double retailPrice;

    // @ToString.Exclude
    @OneToOne(mappedBy = "optic", cascade = CascadeType.ALL, orphanRemoval = true, optional = false)
    private OpticsAddition opticsAddition;

    // @ToString.Exclude
    @OneToMany(mappedBy = "optic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OpticsHasOrder> opticsHasOrderList;

    // @ToString.Exclude
    @OneToMany(mappedBy = "optic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratingList;

    // @ToString.Exclude
    @OneToMany(mappedBy = "optic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionAnswer> questionAnswerList;

    public Optics(Long id, String fullName, String shortName, String brand, String manufacturer, String category,
            String gender, String country, String material, String eyeglass, String polarization, Double groupPrice,
            Double retailPrice, OpticsAddition opticsAddition) {
        this.id = id;
        this.fullName = fullName;
        this.shortName = shortName;
        this.brand = brand;
        this.manufacturer = manufacturer;
        this.category = category;
        this.gender = gender;
        this.country = country;
        this.material = material;
        this.eyeglass = eyeglass;
        this.polarization = polarization;
        this.groupPrice = groupPrice;
        this.retailPrice = retailPrice;
        this.opticsAddition = opticsAddition;
    }
}
