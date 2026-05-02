package ch.supsi.web.cardmarketplace.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import ch.supsi.web.cardmarketplace.model.User;

@Service
public class UserService {

    private final List<User> users = new ArrayList<>();

    public User register(User user) {

        // Check username/email already exists
        boolean exists = users.stream()
            .anyMatch(u ->
                u.getUsername().equals(user.getUsername()) ||
                u.getEmail().equals(user.getEmail())
            );

        if (exists) {
            throw new RuntimeException("User already exists");
        }

        users.add(user);

        return user;
    }

    public String login(String username, String password) {

        User user = users.stream()
            .filter(u ->
                u.getUsername().equals(username) &&
                u.getPassword().equals(password)
            )
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        return user.getUsername();
    }

    // This function uses Universally Unique Identifier built-in to generate a random id like:
    // 550e8400-e29b-41d4-a716-446655440000
    // Which will be used as a token
    public String generateFakeToken() {
        return UUID.randomUUID().toString();
    }
}
