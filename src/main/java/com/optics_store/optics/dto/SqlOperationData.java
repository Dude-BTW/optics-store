package com.optics_store.optics.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
/**
 * Data Transfer Object (DTO).
 * Acts as a secure data container for transferring information between the
 * Front-end and Back-end.
 * Ensures that sensitive internal database structures are not directly exposed
 * to the client side.
 */
public class SqlOperationData {

    public enum Action {
        INSERT, UPDATE, DELETE
    }

    private String tableName;
    private Action action;

    private List<Integer> rowIndices;
    private List<String> columnFormats;

    private List<List<String>> oldValues;
    private List<List<String>> newValues;

    public List<Integer> getRowIndices() {
        if (rowIndices == null)
            rowIndices = new ArrayList<>(4);
        return rowIndices;
    }

    public List<String> getColumnFormats() {
        if (columnFormats == null)
            columnFormats = new ArrayList<>(4);
        return columnFormats;
    }

    public List<List<String>> getOldValues() {
        if (oldValues == null)
            oldValues = new ArrayList<>();
        return oldValues;
    }

    public List<List<String>> getNewValues() {
        if (newValues == null)
            newValues = new ArrayList<>();
        return newValues;
    }
}
