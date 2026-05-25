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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // This function takes the file from the form and places it in uploads folder with id of the card
    // Attribute image in the card points to this image so that it can be retrieved from frontend
    // Card stores Path, not whole file. Whole file is in /uploads.
    private void storeImage(User user) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/user_uploads/";
        String fileName = user.getUsername() + ".jpg";

        Path userdefaulPath = Paths.get(
            System.getProperty("user.dir") +
            "/src/main/resources/static" +
            user.getImage()
        ); // Debug

        Path filePath = Paths.get(uploadDir + fileName);

        // Takes user path and puts it to uploads to have a default upload.
        Files.copy(userdefaulPath, filePath, StandardCopyOption.REPLACE_EXISTING);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) throws IOException {

        // Creates new User and fills it up
        User user = new User();

        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("ROLE_USER");
        user.setImage("/images/design/user_placeholder2.png");

        // Store image to user uploads
        storeImage(user);

        return ResponseEntity.ok(userService.register(user));
    }

    // As Spring handles login, we dont need login endpoint anymore
    // But for frontend changing header on login we need to know if we are logged in
    // header.js will fetch this endpoint and doublecheck
    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> me(Principal principal) {
        /**
         * Calls this endpoint. If logged in 200
         * will find user by id
         * and will return user data, and role data
         * If not logged in returns 401
         */
        
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userService.getByUsername(principal.getName());

        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "role", user.getRole()
        ));
    }
}