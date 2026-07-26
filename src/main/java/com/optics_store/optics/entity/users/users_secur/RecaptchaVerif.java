package com.optics_store.optics.entity.users.users_secur;

import java.time.Instant;

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

@Entity
@Table(name = "recaptcha_verification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
/**
 * Security component: Stores Google reCAPTCHA verification results.
 * Used to track trust scores and prevent automated bot interactions on
 * client-side forms.
 */
public class RecaptchaVerif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long guestId;
    private Long userId;

    private boolean success;
    private String reason;

    private Instant timestamp;

    private Double score;
}
