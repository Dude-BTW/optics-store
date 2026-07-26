package com.optics_store.optics;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.optics_store.optics.excel.ImportExcelDB;
import com.optics_store.optics.excel.excel_sync.ExcelDataInitializer;

@SpringBootApplication
@EnableScheduling
@EnableAsync
@EnableJpaRepositories("com.optics_store.optics.repository")
@DependsOn("entityManagerFactory")
public class OpticsApplication implements CommandLineRunner {

    private final ImportExcelDB importExcelDB;
    private final ExcelDataInitializer excelDataInitializer;

    public OpticsApplication(
            ImportExcelDB importExcelDB,
            ExcelDataInitializer excelDataInitializer) {
        this.importExcelDB = importExcelDB;
        this.excelDataInitializer = excelDataInitializer;
    }

    public static void main(String[] args) {
        SpringApplication.run(OpticsApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

        List<ImportExcelDB.ForeignKeyInfo> foreignKeys = importExcelDB.logForeignKeys();
        importExcelDB.updateForeignKeys(foreignKeys);
        importExcelDB.setupGuestTriggers();

        excelDataInitializer.importAll();
        excelDataInitializer.watchAll();
    }
}
