package pl.pollub.mosaic.config;

import org.springframework.security.config.Customizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import pl.pollub.mosaic.Models.Role;
import pl.pollub.mosaic.filter.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    @Autowired
    private JwtAuthFilter authfilter;
    private static final String[] AUTH_WHITELIST = {
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/auth/**",
            "/mosaic/all",
            "/mosaic/id/**",
            "/tool/all",
            "/tool/id/**",
            "/upload",
            "/files/**",
            "/uploads/**",
            "/upload/**",
    };// lista dozwolonych enpointów dla niezalogowanych

    private static final String[] CLIENT_ENDPONTS = {
            "/order",
            "/order/**",
            "/orders",
            "/orders/**",
    };

    private static final String[] ADMIN_ENDPOINTS = {
            "/mosaic/add",
            "/mosaic/update/**",
            "/mosaic/delete/**",
            "/tool/add",
            "/tool/update/**",
            "/tool/delete/**",
            "/user/all",
            "/orders/all",
            "/order/allOrders",
            "/order/updateStatus/**",
            "/orders/updateStatus/**",

    };//  lista endpointów dla admina


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(AUTH_WHITELIST).permitAll()
                        .requestMatchers(CLIENT_ENDPONTS).hasAnyRole(Role.CUSTOMER.toString(),Role.ADMIN.toString())
                        .requestMatchers(ADMIN_ENDPOINTS).hasAnyRole(Role.ADMIN.toString())
                        .requestMatchers("/**").hasAnyRole(Role.ADMIN.toString())
                )
                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // No sessions
                )
                .addFilterBefore(authfilter, UsernamePasswordAuthenticationFilter.class)// Add JWT filter
                .cors(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

}