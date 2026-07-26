package com.optics_store.optics.entity.users.users_interaction;

import java.time.LocalDateTime;

import com.optics_store.optics.entity.Optics;
import com.optics_store.optics.entity.guests.GuestQuest;
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
@Table(name = "question_answer")
/**
 * User feedback module: Stores user-generated content (reviews, ratings, Q&A).
 * Supports CRUD operations, dynamic UI state updates, and client-side form
 * validation.
 */
public class QuestionAnswer implements ClientAuthorizable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private Boolean isVisible = true;

    @ManyToOne
    @JoinColumn(name = "optic_id", nullable = false)
    private Optics optic;

    private Long clientId;
    private Boolean accountUsed;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private GuestQuest guest;

    @Convert(converter = CryptoConverter.class)
    private String region;

    @Convert(converter = CryptoConverter.class)
    private String timezone;

    @Column(name = "feedback_date", columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime feedbackDate;

    @Column(length = 2000)
    private String feedback;

    @Column(length = 2000)
    private String feedbackAdmin;

    // Excel Changes
    @Builder.Default
    private Boolean excelChanges = false;

    @Override
    public Boolean getAccountUsed() {
        return this.accountUsed;
    }

    @Override
    public Long getClientId() {
        return this.clientId;
    }
}
