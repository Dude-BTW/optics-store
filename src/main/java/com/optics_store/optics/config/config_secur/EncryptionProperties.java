package com.optics_store.optics.config.config_secur;

import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "encryption.keys")
/**
 * Configuration properties binding for symmetric encryption.
 * Securely loads the AES algorithm keys (managed via HashiCorp Vault) used for
 * encrypting personal customer data in the SQL storage.
 */
public class EncryptionProperties {

    private String currentKeyId;
    private Map<String, String> secrets;

    /**
     * Standard accessors (getters/setters) to retrieve the active encryption key ID
     * and the map of available secrets.
     * Grouped functionality for framework data binding.
     */
    public String getCurrentKeyId() {
        return currentKeyId;
    }

    public void setCurrentKeyId(String currentKeyId) {
        this.currentKeyId = currentKeyId;
    }

    public Map<String, String> getSecrets() {
        return secrets;
    }

    public void setSecrets(Map<String, String> secrets) {
        this.secrets = secrets;
    }
}
