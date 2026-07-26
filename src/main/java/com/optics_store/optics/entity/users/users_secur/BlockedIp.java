package com.optics_store.optics.entity.users.users_secur;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.optics_store.optics.security.CryptoConverter;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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

@Entity
@Table(name = "blocked_ip")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
/**
 * Security component: Represents an IP address temporarily or permanently
 * blocked.
 * Implements the infrastructure protection mechanism against automated attacks
 * and Rate Limiting,
 * logging and blocking malicious IP addresses as defined in the system
 * architecture.
 */
public class BlockedIp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ip", nullable = false, unique = true)
    @Convert(converter = CryptoConverter.class)
    private String ip;

    private String reason;

    private Instant blockedAt;

    @OneToMany(mappedBy = "blockedIp", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<BlockedIpTimestamp> timestamps = new ArrayList<>();
}
