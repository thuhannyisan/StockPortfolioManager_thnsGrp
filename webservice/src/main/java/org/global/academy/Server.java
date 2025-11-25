package org.global.academy;

import static spark.Spark.*;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Server {
    private static final String JWT_SECRET = "verysecret";
    private static List<Flashcard> flashcards = new ArrayList<>();
    private static Stock appleStock;
    
    public static void main(String[] args) {
        port(8080);
        staticFiles.location("/public");
        
        // Initialize flashcards
        flashcards.add(new Flashcard("France", "Paris"));
        flashcards.add(new Flashcard("Japan", "Tokyo"));
        flashcards.add(new Flashcard("Brazil", "Brasília"));
        
        // Initialize Apple stock
        appleStock = new Stock("Apple", "AAPL", "NASDAQ", 150.25);
        
        // Simple CORS
        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
        });
        options("/*", (req, res) -> {
            String accessControlRequestHeaders = req.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                res.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }
            String accessControlRequestMethod = req.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                res.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }
            return "OK";
        });

        // JWT protection filter for /securerandom
        before("/securerandom", (req, res) -> {
            String authHeader = req.headers("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                halt(401, "Missing or invalid Authorization header");
            }

            String token = authHeader.substring("Bearer ".length()).trim();
            try {
                JwtUtil.verifyToken(token);
            } catch (Exception e) {
                halt(401, "Invalid or expired token");
            }
        });

        Gson gson = new Gson();

        post("/login", (req, res) -> {
            System.out.println("Received /login request with body: " + req.body());
            LoginRequest lr = gson.fromJson(req.body(), LoginRequest.class);
            
            if ("alice".equals(lr.username) && "secret".equals(lr.password)) {
                String token = JWT.create()
                        .withSubject(lr.username)
                        .withIssuer("your-app")
                        .withClaim("role", "user")
                        .withExpiresAt(new java.util.Date(System.currentTimeMillis() + 3600_000))
                        .sign(Algorithm.HMAC256(JWT_SECRET));
                
                res.type("application/json");
                System.out.println("Generated token: " + token);
                return gson.toJson(new LoginResponse(token, lr.username));
            } else {
                res.status(401);
                res.type("application/json");
                return gson.toJson(new ErrorResponse("Invalid credentials"));
            }
        });

        // Simple random endpoint used by the welcome page (returns JSON with 1..13)
        get("/random", (req, res) -> {
            res.type("application/json");
            int value = new Random().nextInt(13) + 1;
            return gson.toJson(new RandomResponse(value));
        });

        get("/securerandom", (req, res) -> {
            res.type("application/json");
            int value = new Random().nextInt(13) + 1;
            return gson.toJson(new RandomResponse(value));
        });

        get("/randflashcard", (req, res) -> {
            res.type("application/json");
            Flashcard card = flashcards.get(new Random().nextInt(flashcards.size()));
            return gson.toJson(card);
        });

        get("/applestock", (req, res) -> {
            res.type("application/json");
            return gson.toJson(appleStock);
        });
    }
    
    static class LoginRequest {
        String username;
        String password;
    }

    static class LoginResponse {
        String token;
        String username;
        LoginResponse(String t, String u) {
            token = t;
            username = u;
        }
    }

    static class ErrorResponse {
        String error;
        ErrorResponse(String e) {
            error = e;
        }
    }

    static class RandomResponse {
        int value;
        RandomResponse(int v) { value = v; }
    }
}
