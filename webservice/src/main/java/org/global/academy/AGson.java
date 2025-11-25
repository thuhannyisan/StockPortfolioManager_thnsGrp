package org.global.academy;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class AGson {
    /**
     * Fetch the current price for the provided symbol using Yahoo Finance chart endpoint.
     * Returns null on failure.
     */
    public static Double fetchPrice(String symbol) {
        if (symbol == null || symbol.isEmpty()) return null;
        try {
            String s = URLEncoder.encode(symbol.toLowerCase(), StandardCharsets.UTF_8);
            String urlString = "https://query1.finance.yahoo.com/v8/finance/chart/" + s;
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
            try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = in.readLine()) != null) {
                    response.append(line);
                }
                JsonObject json = JsonParser.parseString(response.toString()).getAsJsonObject();
                JsonObject chart = json.getAsJsonObject("chart");
                if (chart == null || !chart.has("result")) return null;
                JsonObject result = chart.getAsJsonArray("result").get(0).getAsJsonObject();
                if (result == null) return null;
                JsonObject meta = result.getAsJsonObject("meta");
                if (meta != null && meta.has("regularMarketPrice")) {
                    return meta.get("regularMarketPrice").getAsDouble();
                }
            }
            conn.disconnect();
        } catch (Exception e) {
            System.out.println("AGson.fetchPrice error for " + symbol + ": " + e.getMessage());
        }
        return null;
    }
}

 
