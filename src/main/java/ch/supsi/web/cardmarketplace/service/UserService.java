package ch.supsi.web.cardmarketplace.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import ch.supsi.web.cardmarketplace.model.User;
import ch.supsi.web.cardmarketplace.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

        return userRepository.save(user);
    }

    public String login(String username, String password) {

        Optional<User> user = userRepository.findByUsernameAndPassword(username, password);

        return user.orElseThrow(() -> new RuntimeException("Invalid credentials")).getUsername();
    }

    // This function uses Universally Unique Identifier built-in to generate a random id like:
    // 550e8400-e29b-41d4-a716-446655440000
    // Which will be used as a token
    public String generateFakeToken() {
        return UUID.randomUUID().toString();
    }
}
