package ch.supsi.web.cardmarketplace.controller;

import ch.supsi.web.cardmarketplace.model.User;
import ch.supsi.web.cardmarketplace.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;


@RestController
@RequestMapping("/api/users")
public class UserApiController {
    private final UserService userService;

    // Always use constructor to instance variables
    public UserApiController(UserService userService) {
        this.userService = userService;
    }

    // This function takes the file from the form and places it in uploads folder with id of the card
    // Attribute image in the card points to this image so that it can be retrieved from frontend
    // Card stores Path, not whole file. Whole file is in /uploads.
    private String storeImage(User user, MultipartFile image) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/user_uploads/";
        String fileName = user.getUsername() + ".jpg";

        Path filePath = Paths.get(uploadDir + fileName);

        // Overwrite old image if exists
        Files.write(filePath, image.getBytes());

        user.setImage("/uploads/" + fileName);

        return "/user_uploads/" + fileName.toString(); // DEBUG: Was storing whole path
    }

    @GetMapping("/{username}")
    public User getByUsername(@PathVariable String username) {
        return userService.getByUsername(username);
    }

    // UPDATE PROFILE
    @PutMapping("/update")
    public ResponseEntity<User> updateProfile(
            Principal principal,
            @RequestParam String name,
            @RequestParam String surname,
            @RequestParam String email,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {

        User user = userService.getByUsername(principal.getName());

        String imagePath = storeImage(user, image);

        User updatedUser = userService.updateProfile(
                principal.getName(),
                name,
                surname,
                email,
                imagePath
        );

        return ResponseEntity.ok(updatedUser);
    }

}

