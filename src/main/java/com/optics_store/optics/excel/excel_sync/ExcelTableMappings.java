package com.optics_store.optics.excel.excel_sync;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.stereotype.Component;

import com.optics_store.optics.config.ExcelMappingsProperties;
import com.optics_store.optics.excel.excel_sync.ExcelOperationService.TableInfo;

import jakarta.persistence.Entity;

@Component
/**
 * Component of the custom two-way asynchronous synchronization system.
 * Facilitates seamless data exchange between the online MariaDB SQL database
 * and the offline store's Excel documents.
 */
public class ExcelTableMappings implements InitializingBean {

    private final ExcelMappingsProperties properties;
    private final Map<Class<?>, TableInfo> tableMappings = new LinkedHashMap<>();
    private final Map<String, Class<?>> entityClassMap = new ConcurrentHashMap<>();

    private static final String BASE_PATH = "static/excel_table/";
    private static final String FILE_EXTENSION = ".xlsx";

    public ExcelTableMappings(ExcelMappingsProperties properties) {
        this.properties = properties;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        scanEntityClasses("com.optics_store.optics.entity");

        for (ExcelMappingsProperties.Mapping mapping : properties.getMappings()) {
            Class<?> clazz = entityClassMap.get(mapping.getSimpleName());
            if (clazz == null) {
                throw new RuntimeException(
                        "Клас з назвою '" + mapping.getSimpleName() + "' не знайдено серед @Entity.");
            }

            String filePath = BASE_PATH + mapping.getFileName() + FILE_EXTENSION;
            tableMappings.put(clazz, new TableInfo(filePath, mapping.getSheetIndex()));
        }
    }

    private void scanEntityClasses(String basePackage) {
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(Entity.class));

        scanner.findCandidateComponents(basePackage).forEach(beanDef -> {
            try {
                String className = beanDef.getBeanClassName();
                Class<?> clazz = Class.forName(className);
                entityClassMap.put(clazz.getSimpleName(), clazz);
            } catch (ClassNotFoundException e) {
                throw new RuntimeException("Помилка під час завантаження класу: " + beanDef.getBeanClassName(), e);
            }
        });
    }

    public Map<Class<?>, TableInfo> getMappings() {
        return tableMappings;
    }

    public TableInfo getTableInfo(Class<?> clazz) {
        return tableMappings.get(clazz);
    }
}
