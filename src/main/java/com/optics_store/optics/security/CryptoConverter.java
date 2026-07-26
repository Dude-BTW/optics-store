package com.optics_store.optics.security;

import org.springframework.stereotype.Component;

import com.optics_store.optics.util.CryptoUtil;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Component
@Converter
/**
 * Security module: Symmetric encryption component.
 * Implements the AES encryption algorithm to protect sensitive personal
 * customer data in the SQL storage,
 * ensuring compliance with data protection standards as outlined in the
 * platform architecture.
 */
public class CryptoConverter implements AttributeConverter<String, String> {

    private final CryptoUtil cryptoUtil;

    public CryptoConverter(CryptoUtil cryptoUtil) {
        this.cryptoUtil = cryptoUtil;
    }

    @Override
    /**
     * JPA Attribute Converter methods.
     * Automatically encrypts data (e.g., client names, phones) before writing to
     * the database
     * and decrypts it upon retrieval, seamlessly integrating AES encryption into
     * the application's data layer.
     */
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null)
            return null;
        return cryptoUtil.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null)
            return null;
        return cryptoUtil.decrypt(dbData);
    }
}
