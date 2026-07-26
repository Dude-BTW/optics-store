package com.optics_store.optics.entity;

import java.time.LocalDateTime;

import com.optics_store.optics.entity.users.Client;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "orders")
/**
 * Business logic entity representing a customer transaction.
 * Ties the Client to the requested products and tracks fulfillment status.
 */
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    private int quantity;
    private LocalDateTime orderDate;
    private String payment;
    private String delivery;
    private boolean statusOrder;

    // Excel Changes
    private Boolean excelChanges;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, optional = false)
    private OpticsHasOrder opticsHasOrder;
}
