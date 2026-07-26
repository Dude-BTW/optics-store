package com.optics_store.optics.entity.history.his_user_interaction;

import java.time.LocalDateTime;

import com.optics_store.optics.entity.users.users_interaction.QuestionAnswer;

import jakarta.persistence.Column;
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

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "question_answer_history")
/**
 * Database entity representing a structural component of the e-commerce
 * platform.
 * Mapped to the SQL storage and integrated with the two-way asynchronous Excel
 * synchronization system.
 */
public class QuestionAnswerHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean isVisible;

    @ManyToOne
    @JoinColumn(name = "question_answer_id")
    private QuestionAnswer question;

    @Column(name = "feedback_date", columnDefinition = "DATETIME(0) DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime feedbackDate;

    @Column(length = 2000)
    private String feedback;

    @Column(length = 2000)
    private String feedbackAdmin;
}
