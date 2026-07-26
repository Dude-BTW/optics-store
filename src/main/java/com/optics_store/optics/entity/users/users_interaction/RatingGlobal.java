package com.optics_store.optics.entity.users.users_interaction;

import java.time.LocalDateTime;

import com.optics_store.optics.entity.guests.GuestRatingGlob;
import com.optics_store.optics.security.CryptoConverter;
import com.optics_store.optics.service.serv_client.ClientAuthorizable;

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
@Table(name = "rating_global")
/**
 * Database entity representing a structural component of the e-commerce
 * platform.
 * Mapped to the SQL storage and integrated with the two-way asynchronous Excel
 * synchronization system.
 */
public class RatingGlobal implements ClientAuthorizable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private Boolean isVisible = true;

    private Long clientId;
    private Boolean accountUsed;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private GuestRatingGlob guest;

    @Convert(converter = CryptoConverter.class)
    private String region;

    @Convert(converter = CryptoConverter.class)
    private String timezone;

    @Column(name = "feedback_date", columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime feedbackDate;

    private Double starPrice;
    private Double starProductQuality;
    private Double starDelivery;
    private Double starStoreRating;

    @Column(length = 2000)
    private String feedback;

    @Column(length = 2000)
    private String feedbackAdmin;

    @Override
    public Boolean getAccountUsed() {
        return this.accountUsed;
    }

    @Override
    public Long getClientId() {
        return this.clientId;
    }
}
