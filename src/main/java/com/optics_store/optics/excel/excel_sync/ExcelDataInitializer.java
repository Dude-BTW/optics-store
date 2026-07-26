package com.optics_store.optics.excel.excel_sync;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.optics_store.optics.excel.ExcelChanger;
import com.optics_store.optics.excel.ImportExcelDB;
import com.optics_store.optics.excel.excel_sync.ExcelOperationService.TableInfo;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
/**
 * Component of the custom two-way asynchronous synchronization system.
 * Facilitates seamless data exchange between the online MariaDB SQL database
 * and the offline store's Excel documents.
 */
public class ExcelDataInitializer {

    private final ImportExcelDB importExcelDB;
    private final ExcelChanger excelChanger;
    private final ExcelTableMappings tableMappings;

    public void importAll() {
        for (Map.Entry<Class<?>, TableInfo> entry : tableMappings.getMappings().entrySet()) {
            importExcelDB.importData(entry.getKey(), entry.getValue().filePath(), entry.getValue().sheetIndex());
        }
    }

    public void watchAll() {
        for (Map.Entry<Class<?>, TableInfo> entry : tableMappings.getMappings().entrySet()) {
            excelChanger.watchFileChanges(entry.getKey(), entry.getValue().filePath(), entry.getValue().sheetIndex());
        }
    }
}
