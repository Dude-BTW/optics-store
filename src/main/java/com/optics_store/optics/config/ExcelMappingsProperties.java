package com.optics_store.optics.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "excel")
/**
 * Configuration properties binding for the two-way asynchronous synchronization
 * system.
 * Maps database entities to specific Excel documents and sheet indices to
 * optimize the custom storage sync mechanism.
 */
public class ExcelMappingsProperties {

    private List<Mapping> mappings;

    @Getter
    @Setter
    public static class Mapping {
        private String simpleName;
        private String fileName;
        private int sheetIndex;
    }
}
