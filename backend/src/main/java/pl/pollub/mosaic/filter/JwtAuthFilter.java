package pl.pollub.mosaic.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import pl.pollub.mosaic.Models.Users;
import pl.pollub.mosaic.Repositories.UserRepository;
import pl.pollub.mosaic.Services.JwtService;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private static final String[] WHITELIST = {
            "/auth/login",
            "/register",
            "/upload",
            "/files/",
            "/mosaic/all",
            "/tool/all",
            "/v3/api-docs",
            "/swagger-ui"
    };

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        System.out.println("[" + request.getMethod() + "]: " + request.getServletPath());

        String path = request.getServletPath();
        for (String allowed : WHITELIST) {
            if (path.startsWith(allowed)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        final String authorizationHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String email;

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            System.out.println("Brak tokenu lub zły format: " + authorizationHeader);
            return;
        }

        jwtToken = authorizationHeader.substring(7);
        email = jwtService.extractEmail(jwtToken);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            if (jwtService.validateToken(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        // Set user attributes for controllers
        Users u = userRepository.findByEmail(email).orElse(null);
        if (u != null) {
            request.setAttribute("Role", u.getRole());
            request.setAttribute("Username", u.getName());
            request.setAttribute("Email", u.getEmail());
        } else {
            System.out.println("Nie znaleziono użytkownika: " + email);
        }

        filterChain.doFilter(request, response);
    }
}

