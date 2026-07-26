package com.optics_store.optics.cache.cache_addit;

import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;

public class CacheKey {

    private final String name;
    private final Map<String, String> params;

    public CacheKey(String name, Map<String, String> params) {
        this.name = name;
        this.params = new TreeMap<>(params);
    }

    public CacheKey(String name, String ip, String requestPath) {
        this.name = name;
        this.params = new TreeMap<>();
        this.params.put("ip", ip);
        this.params.put("path", requestPath);
    }

    public String getIp() {
        return params.get("ip");
    }

    public String getPath() {
        return params.get("path");
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, params);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!(obj instanceof CacheKey))
            return false;
        CacheKey other = (CacheKey) obj;
        return Objects.equals(name, other.name) && Objects.equals(params, other.params);
    }

    @Override
    public String toString() {
        return name + "|" + params.toString();
    }
}
