package ch.supsi.web.cardmarketplace.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.supsi.web.cardmarketplace.model.LoginRequest;
import ch.supsi.web.cardmarketplace.model.LoginResponse;
import ch.supsi.web.cardmarketplace.model.RegisterRequest;
import ch.supsi.web.cardmarketplace.model.User;
import ch.supsi.web.cardmarketplace.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(
            @RequestBody RegisterRequest request
    ) {

        // Creates new User and fills it up
        User user = new User();

        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return ResponseEntity.ok(userService.register(user));
    }

    // We do post as we wanna create a LoginRequest DTO object, not retreiveing info
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        String user = userService.login(request.getUsername(), request.getPassword());
        String token = userService.generateFakeToken();

        return ResponseEntity.ok(new LoginResponse(token, user));
    }
}