package com.optics_store.optics.entity.users.users_secur;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "blocked_ip_timestamps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
/**
 * Database entity representing a structural component of the e-commerce
 * platform.
 * Mapped to the SQL storage and integrated with the two-way asynchronous Excel
 * synchronization system.
 */
public class BlockedIpTimestamp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @Column(name = "request_path", nullable = false)
    private String requestPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recaptcha_verif_id")
    private RecaptchaVerif recaptchaVerif;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocked_ip_id")
    private BlockedIp blockedIp;
}
