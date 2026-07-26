package com.optics_store.optics.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.ZoneId;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
/**
 * Geolocation Utility.
 * Enhances the user feedback modules (questions, reviews, ratings) by
 * automatically determining the client's time zone and region based on their IP
 * address.
 */
public class IpGeoService {

    public static class IpRegionResult {
        public final String region;
        public final ZoneId zoneId;

        public IpRegionResult(String region, ZoneId zoneId) {
            this.region = region;
            this.zoneId = zoneId;
        }
    }

    /**
     * Geolocation processing methods.
     * Queries IP databases or services to append accurate regional metadata to user
     * interactions, ensuring correct chronological display and context in the UI.
     */
    public IpRegionResult getRegionFromIp(String ip) {
        try {
            java.net.URI uri = new java.net.URI("http", "ip-api.com", "/json/" + ip,
                    "fields=status,regionName,timezone", null);
            URL url = uri.toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                StringBuilder json = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    json.append(line);
                }

                JSONObject obj = new JSONObject(json.toString());
                if ("success".equals(obj.getString("status"))) {
                    String region = obj.getString("regionName");
                    String tz = obj.getString("timezone");
                    return new IpRegionResult(region, ZoneId.of(tz));
                }
            }
        } catch (Exception e) {
        }
        return new IpRegionResult("UNKNOWN", ZoneId.systemDefault());
    }
}
