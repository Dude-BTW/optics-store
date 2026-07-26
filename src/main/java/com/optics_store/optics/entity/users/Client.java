package com.optics_store.optics.entity.users;

import java.util.List;

import com.optics_store.optics.entity.Order;
import com.optics_store.optics.security.CryptoConverter;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name = "clients")
/**
 * Represents a registered customer profile in the platform.
 * Personal data fields are subject to symmetric encryption (AES algorithm) for
 * data protection.
 */
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 510)
    @Convert(converter = CryptoConverter.class)
    private String firstName;

    @Column(length = 510)
    @Convert(converter = CryptoConverter.class)
    private String lastName;

    @Convert(converter = CryptoConverter.class)
    private String phone;

    private String email;

    @Convert(converter = CryptoConverter.class)
    private String city;

    private String groupCustomer;
    private String retailCustomer;
    private String category;
    private String status;
    private Double discount;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orderList;
}
