package ch.supsi.web.cardmarketplace.controller;

import ch.supsi.web.cardmarketplace.model.Card;
import ch.supsi.web.cardmarketplace.service.CardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

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
    private void storeImage(Card card, MultipartFile image) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/uploads/";
        String fileName = card.getId() + ".jpg";

        Path filePath = Paths.get(uploadDir + fileName);
        Files.write(filePath, image.getBytes());

        card.setImage("/uploads/" + fileName);
    }

    // =========================
    // 1. Add a new card (Sell)
    // =========================
    // This adds a card to memory: it is a list in service/CardService
    // Redirects to home and there posted card should be seen.
    @PostMapping("/new")
    public ResponseEntity<Card> createCard(
            @RequestParam String name,
            @RequestParam String vendor,
            @RequestParam double price,
            @RequestParam String rarity,
            @RequestParam String condition,
            @RequestParam String collection,
            @RequestParam(required = false) String description,
            @RequestParam MultipartFile image
    ) throws IOException {

        Card card = new Card();
        card.setName(name);
        card.setVendor(vendor);
        card.setPrice(price);
        card.setRarity(rarity);
        card.setCondition(condition);
        card.setCollection(collection);
        card.setDescription(description);
        card.setDate(LocalDateTime.now()); // Adds todays date
        card.setImage(null);

        cardService.addCard(card);

        if (!image.isEmpty()) {
            storeImage(card, image);
        }

        return ResponseEntity.ok(card); // This is to show "Form successfully submitted message"
    }

    // =========================
    // 2. Latest arrivals (Home)
    // =========================
    @GetMapping("/latest")
    public List<Card> getLatest() {
        return cardService.getLatest(3);
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
    // 4. Optional: full list (debug/search)
    // =========================
    @GetMapping("/all")
    public List<Card> getAll() {
        return cardService.getAllCards();
    }

    // =========================
    // 5. Modal Card Preview (Home)
    // =========================
    @GetMapping("/{id}")
    public Card getById(@PathVariable int id) {
        return cardService.getCardById(id);
    }
}
