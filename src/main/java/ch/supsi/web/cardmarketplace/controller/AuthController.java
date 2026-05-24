package ch.supsi.web.cardmarketplace.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.supsi.web.cardmarketplace.model.RegisterRequest;
import ch.supsi.web.cardmarketplace.model.User;
import ch.supsi.web.cardmarketplace.service.UserService;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {

        // Creates new User and fills it up
        User user = new User();

        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("ROLE_USER");

        return ResponseEntity.ok(userService.register(user));
    }

    // As Spring handles login, we dont need login endpoint anymore
    // But for frontend changing header on login we need to know if we are logged in
    // header.js will fetch this endpoint and doublecheck
    @GetMapping("/me")
    public ResponseEntity<String> me(Principal principal) {
        /**
         * 
         */
        
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(principal.getName());
    }
}