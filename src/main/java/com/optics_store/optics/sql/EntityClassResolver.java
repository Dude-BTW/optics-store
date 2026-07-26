package com.optics_store.optics.sql;

import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Table;
import jakarta.persistence.metamodel.EntityType;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
/**
 * Custom SQL filter/handler component.
 * Supports the query interception mechanism required for synchronizing the
 * MariaDB database with offline Excel documents.
 */
public class EntityClassResolver {

    private Map<String, Class<?>> tableToEntity;
    private final EntityManager entityManager;

    @PostConstruct
    public void init() {
        Map<String, Class<?>> localMap = new HashMap<>();
        for (EntityType<?> entityType : entityManager.getMetamodel().getEntities()) {
            Class<?> clazz = entityType.getJavaType();
            String tableName = clazz.isAnnotationPresent(Table.class)
                    ? clazz.getAnnotation(Table.class).name()
                    : clazz.getSimpleName().toLowerCase(Locale.ROOT);

            localMap.put(tableName.toLowerCase(Locale.ROOT), clazz);
        }
        this.tableToEntity = Collections.unmodifiableMap(localMap);
    }

    public Optional<Class<?>> resolveByTableName(String tableName) {
        if (tableName == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(tableToEntity.get(tableName.toLowerCase(Locale.ROOT)));
    }
}
