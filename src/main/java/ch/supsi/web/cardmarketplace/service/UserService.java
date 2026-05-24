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
    // Finds by id
    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("User not found"));
    }

    // Finds by username
    public User getByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() ->
            new RuntimeException("User not found"));
    }

    public User updateProfile(
            String username,
            String name,
            String surname,
            String email, 
            String image
    ) {
        // Make changes on class
        User user = getByUsername(username); // Finds user by username
        user.setName(name);
        user.setSurname(surname);
        user.setEmail(email);
        user.setImage(image);

        // Update DB
        return userRepository.save(user);
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
