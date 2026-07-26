package com.optics_store.optics.entity.main_page;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "card_navbar1")
/**
 * Database entity representing a structural component of the e-commerce
 * platform.
 * Mapped to the SQL storage and integrated with the two-way asynchronous Excel
 * synchronization system.
 */
public class CardNavbar1 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long opticId;
}
