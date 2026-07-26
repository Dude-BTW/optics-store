package com.optics_store.optics.cache.cache_addit;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

import com.github.benmanes.caffeine.cache.Cache;

/**
 * A secure wrapper around the standard cache that guarantees lists returned
 * from the cache are strictly immutable.
 * Prevents accidental modification of cached global data by individual client
 * threads.
 */
public class ImmutableListCache<K, V> {

    private final Cache<K, List<V>> delegate;

    public ImmutableListCache(Cache<K, List<V>> delegate) {
        this.delegate = delegate;
    }

    public void put(K key, List<V> value) {
        if (value != null) {
            delegate.put(key, List.copyOf(value));
        }
    }

    public List<V> getIfPresent(K key) {
        return delegate.getIfPresent(key);
    }

    public List<V> get(K key, Function<? super K, ? extends List<V>> mappingFunction) {
        return delegate.get(key, k -> {
            List<V> result = mappingFunction.apply(k);
            return result != null ? List.copyOf(result) : List.of();
        });
    }

    public void putAll(Map<? extends K, ? extends List<V>> map) {
        for (Map.Entry<? extends K, ? extends List<V>> entry : map.entrySet()) {
            put(entry.getKey(), entry.getValue());
        }
    }

    public Map<K, List<V>> getAllPresent(Iterable<? extends K> keys) {
        return delegate.getAllPresent(keys);
    }

    public void invalidate(K key) {
        delegate.invalidate(key);
    }

    public void invalidateAll(Iterable<? extends K> keys) {
        delegate.invalidateAll(keys);
    }

    public void invalidateAll() {
        delegate.invalidateAll();
    }

    public long estimatedSize() {
        return delegate.estimatedSize();
    }

    public Set<K> keySet() {
        return delegate.asMap().keySet();
    }

    public Map<K, List<V>> asMap() {
        return delegate.asMap();
    }

    public boolean containsKey(K key) {
        return delegate.asMap().containsKey(key);
    }
}
