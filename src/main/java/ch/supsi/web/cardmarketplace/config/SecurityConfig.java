package ch.supsi.web.cardmarketplace.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import ch.supsi.web.cardmarketplace.service.CustomUserDetailsService;


@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
        /**
         * We need our UserDetailsService here to pass it on config 
         * so that Spring knows it has to use that for login. 
         * IMPORTANT TO ADD!! -> securityFilterChain
        */ 
    }

    @Bean // Bean is a config object created and sharted among whole project globally
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder(); // Here we are registering a BCrypt encoder for passwords
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        /**
         * By default Spring security requires auth for everything, including endpoints
         * Here we are telling for which endpoints not require authorization. 
         * Basically:
         * /login	            pública
         * /register	        pública
         * /api/auth/register	pública
         * /api/auth/login	    pública
         * /card/new	        autenticado
         * resto	            permitido o protegido
         */

        http.csrf(csrf -> csrf.disable())
            .userDetailsService(customUserDetailsService) // Here we are telling Spring to use our userDetails service
            .authorizeHttpRequests(auth -> auth
                // AUTH REQUIRED Endpoints
                /**
                 * Authenticated users should be able to update
                 * Only their owned cards
                 */
                .requestMatchers("/profile").authenticated()
                .requestMatchers("/api/users/**").authenticated()

                // ADMIN ONLY Endpoints
                /**
                 * Admins can create, delete, update cards no matter user
                 * To be configured
                 */
                // .requestMatchers(
                //     ""
                // ).hasRole("ADMIN")

                // Pages and endpoints should be all public (easy and fast way to do it)
                .anyRequest().permitAll()
            )

            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            )

            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
            );

        return http.build();
    }
}
