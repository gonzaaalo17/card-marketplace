package ch.supsi.web.cardmarketplace.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import ch.supsi.web.cardmarketplace.model.User;
import ch.supsi.web.cardmarketplace.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Injecting password encoder from config

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {

        if (user.getUsername() == null || user.getUsername().isBlank() ||
            user.getEmail() == null || user.getEmail().isBlank()) {
            throw new RuntimeException("Username and email are required");
        }

        boolean exists = userRepository.existsByUsernameOrEmail(
            user.getUsername(), user.getEmail());

        if (exists) {
            throw new RuntimeException("User already exists");
        }

        // If tests pass encrypt password and save user with password encrypted
        user.setPassword(
            passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    // Since Login is entirely handled by UserDetailsService, we dont need a login method
}
