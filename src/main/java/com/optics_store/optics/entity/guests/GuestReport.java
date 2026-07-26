package com.optics_store.optics.entity.guests;

import com.optics_store.optics.security.CryptoConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "guests_report")
/**
 * Database entity representing a structural component of the e-commerce
 * platform.
 * Mapped to the SQL storage and integrated with the two-way asynchronous Excel
 * synchronization system.
 */
public class GuestReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    @Column(length = 510)
    @Convert(converter = CryptoConverter.class)
    private String guestName;

    @Convert(converter = CryptoConverter.class)
    private String phone;

    private String email;
}
