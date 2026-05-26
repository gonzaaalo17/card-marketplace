package ch.supsi.web.cardmarketplace.controller;

import ch.supsi.web.cardmarketplace.model.Card;
import ch.supsi.web.cardmarketplace.service.CardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
public class CardApiController {
    private final CardService cardService;

    // Always use constructor to instance variables
    public CardApiController(CardService cardService) {
        this.cardService = cardService;
    }

    // This function takes the file from the form and places it in uploads folder with id of the card
    // Attribute image in the card points to this image so that it can be retrieved from frontend
    // Card stores Path, not whole file. Whole file is in /uploads.
    private String storeImage(Card card, MultipartFile image) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/uploads/";
        String fileName = card.getId() + ".jpg";

        Path filePath = Paths.get(uploadDir + fileName);
        Files.write(filePath, image.getBytes());

        String imagePath = "/uploads/" + fileName;
        card.setImage(imagePath);
        return imagePath;
    }

    // =========================
    // 1. Add a new card (Sell)
    // =========================
    // This adds a card to memory: it is a list in service/CardService
    // Redirects to home and there posted card should be seen.
    @PostMapping("/new")
    public ResponseEntity<Card> createCard(
            Principal principal,
            @RequestParam String name,
            @RequestParam String vendor,
            @RequestParam double price,
            @RequestParam String rarity,
            @RequestParam String condition,
            @RequestParam String collection,
            @RequestParam(required = false) String description,
            @RequestParam MultipartFile image
    ) throws IOException {

        String username = principal.getName();

        Card card = new Card();
        card.setName(name);
        card.setVendor(username);
        card.setPrice(price);
        card.setRarity(rarity);
        card.setCardCondition(condition);
        card.setCollection(collection);
        card.setDescription(description);
        card.setCreatedDate(LocalDateTime.now()); // Adds todays date
        card.setImage(null);

        Card savedCard = cardService.addCard(card);

        if (!image.isEmpty()) {
            String imagePath = storeImage(savedCard, image);
            savedCard.setImage(imagePath);
            savedCard = cardService.addCard(savedCard);
        }

        return ResponseEntity.ok(savedCard); // This is to show "Form successfully submitted message"
    }

    // =========================
    // 2. Latest arrivals (Home)
    // =========================
    @GetMapping("/latest")
    public List<Card> getLatest() {
        return cardService.getLatest();
    }

    // =========================
    // 3. Carousel pagination (Home)
    // =========================
    @GetMapping("/carousel")
    public List<Card> getCarousel(
            @RequestParam int offset,
            @RequestParam int limit
    ) {
        return cardService.getPage(offset, limit);
    }

    // =========================
    // 4. Update card
    // =========================
    @PutMapping("/update")
    public ResponseEntity<Card> updateCard(
            Principal principal,
            @RequestParam Long id,
            @RequestParam String name,
            @RequestParam double price,
            @RequestParam String rarity,
            @RequestParam String condition,
            @RequestParam String collection,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {

        String username = principal.getName();

        Card existingCard = cardService.getCardById(id);
        if (existingCard == null) {
            return ResponseEntity.notFound().build();
        }

        if (!username.equals(existingCard.getVendor())) {
            return ResponseEntity.status(403).build();
        }

        String imagePath = null;
        if (image != null && !image.isEmpty()) {
            imagePath = storeImage(existingCard, image);
        }

        Card updatedCard = cardService.updateCard(
                id,
                name,
                username,
                price,
                rarity,
                condition,
                collection,
                description,
                imagePath
        );

        return ResponseEntity.ok(updatedCard);
    }

    // =========================
    // 5. Optional: full list (debug/search)- ONLY ADMIN
    // =========================
    @GetMapping("/all")
    public ResponseEntity<List<Card>> getAll(Authentication authentication) {
        // Extra security check so that no non-admin users access endpoint
        if (authentication == null || authentication.getAuthorities().stream()
                .noneMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(cardService.getAllCards());
    }

    // =========================
    // 6. Delete card announcement
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(
            Principal principal,
            Authentication authentication,
            @PathVariable Long id
    ) {
        Card existingCard = cardService.getCardById(id);
        if (existingCard == null) {
            return ResponseEntity.notFound().build();
        }

        String username = principal != null ? principal.getName() : null;
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && (username == null || !username.equals(existingCard.getVendor()))) {
            return ResponseEntity.status(403).build();
        }

        cardService.deleteCard(id);
        return ResponseEntity.noContent().build();
    }

    // =========================
    // 7. Modal Card Preview (Home)
    // =========================
    @GetMapping("/{id}")
    public Card getById(@PathVariable Long id) {
        return cardService.getCardById(id);
    }

    // ==========================
    // 6. Search pages
    // ==========================
    @GetMapping("/search")
    public Map<String, Object> searchCards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String vendor,
            @RequestParam(required = false) List<String> collections,
            @RequestParam(required = false) List<String> conditions,
            @RequestParam(required = false) String rarity,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String date
    ) {
        return cardService.searchPaged(page, size, name, vendor, collections, conditions, rarity, sort, date);
    }
}
