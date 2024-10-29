package com.chatapp.userservice.security;

import com.chatapp.userservice.entity.User;
import com.chatapp.userservice.exception.ApiException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JwtProvider {

    final CustomizedUserDetailsService customizedUserDetailsService;

    @Value("${yml.jwt-secrete-key}")
    String secreteKey;

    @Value("${yml.jwt-expiration-time}")
    long expirationDate;

    public Date getExpirationDate(long expirationDate){
        Date currentDate = new Date();
        return new Date(currentDate.getTime()+expirationDate);
    }

    public Claims getClaims(String token){
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims;
    }

    // username is email
    public String getUsername(String token){
        Claims claims =getClaims(token);
        return claims.getSubject();
    }

    public Authentication getAuthentication(String token){
        CustomizedUserDetails customizedUserDetails = (CustomizedUserDetails) customizedUserDetailsService
                .loadUserByUsername(getUsername(token));
        return new UsernamePasswordAuthenticationToken(customizedUserDetails,"",customizedUserDetails.getAuthorities());
    }

    public Date getExpirationDate(String token){
        Claims claims = getClaims(token);
        return claims.getExpiration();
    }

    public SecretKey getSecretKey(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(this.secreteKey));
    }

    public String generateToken(Object object){
        Date expirationDate = getExpirationDate(this.expirationDate);
        String token = "";

        if (object instanceof CustomizedUserDetails){
            CustomizedUserDetails customizedUserDetails = (CustomizedUserDetails) object;
            token = Jwts
                    .builder()
                    .signWith(getSecretKey())
                    .subject(customizedUserDetails.getUsername())
                    .expiration(expirationDate)
                    .issuedAt(new Date())
                    .claim("Authorities",customizedUserDetails.getAuthorities())
                    .compact();
        }else if(object instanceof User){
            User user = (User) object;
            token = Jwts
                    .builder()
                    .signWith(getSecretKey())
                    .subject(user.getEmail())
                    .expiration(expirationDate)
                    .issuedAt(new Date())
                    .claim("Authorities",user.getRole().getName())
                    .compact();
        }

        return token;
    }

    public boolean validateToken(String token){
        try{
            Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token);
            return getExpirationDate(token).after(new Date());
        } catch (MalformedJwtException ex) {
            throw new ApiException("Invalid Jwt Token", HttpStatus.UNAUTHORIZED);
        } catch (ExpiredJwtException ex) {
            throw new ApiException("Expired Jwt Token",HttpStatus.UNAUTHORIZED);
        } catch (UnsupportedJwtException ex) {
            throw new ApiException("Unsupported Jwt Token",HttpStatus.UNAUTHORIZED);
        } catch (IllegalArgumentException ex) {
            throw new ApiException("Jwt claims string is empty",HttpStatus.UNAUTHORIZED);
        }
    }

}
