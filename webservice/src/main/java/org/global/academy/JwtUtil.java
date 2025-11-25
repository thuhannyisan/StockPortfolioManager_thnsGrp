package org.global.academy;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

public class JwtUtil {
    private static final String SECRET = "verysecret"; // keep safe
    private static final Algorithm ALGO = Algorithm.HMAC256(SECRET);
    private static final JWTVerifier VERIFIER = JWT.require(ALGO).build();

    public static DecodedJWT verifyToken(String token) {
        return VERIFIER.verify(token); // throws if invalid
    }
}