package com.optics_store.optics.sql;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.optics_store.optics.dto.SqlOperationData;
import com.optics_store.optics.sync.ExcelSyncScheduler;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
/**
 * Custom SQL filter/handler component.
 * Supports the query interception mechanism required for synchronizing the
 * MariaDB database with offline Excel documents.
 */
public class SqlLoggingFilter extends OncePerRequestFilter {

    private static final Set<String> TARGET_PATHS = Set.of(
            "/add_like_dislike_global", "/add_like_dislike",

            "/rating_global", "/edit_rating_global", "/remove_rating_global",
            "/rating", "/edit_rating", "/remove_rating",
            "/question_answer", "/edit_question_answer", "/remove_question_answer",
            "/report_availability", "/edit_report_availability", "/remove_report_availability",

            "/register", "/login");

    @Autowired
    private ExcelSyncScheduler excelSyncScheduler;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws IOException, ServletException {

        boolean shouldLog = "POST".equalsIgnoreCase(request.getMethod())
                && TARGET_PATHS.contains(request.getServletPath());

        if (shouldLog) {
            SqlLoggingContext.enable();
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            if (shouldLog) {
                List<SqlOperationData> ops = SqlCaptureInspector.getOperations();

                for (SqlOperationData op : ops) {
                    log.info("Table: {}, Action: {}", op.getTableName(), op.getAction());

                    switch (op.getAction()) {
                        case INSERT -> {
                            log.debug("Formats: {}", op.getColumnFormats());
                            log.debug("New values: {}", op.getNewValues());
                        }
                        case UPDATE -> {
                            log.debug("Formats: {}", op.getColumnFormats());
                            log.debug("New values: {}", op.getNewValues());
                            log.debug("Old values: {}", op.getOldValues());
                        }
                        case DELETE -> {
                            log.debug("Old values: {}", op.getOldValues());
                        }
                    }
                }

                if (!ops.isEmpty()) {
                    excelSyncScheduler.scheduleBatch(ops);
                }

                SqlCaptureInspector.clear();
                SqlLoggingContext.clear();
            }
        }
    }
}
