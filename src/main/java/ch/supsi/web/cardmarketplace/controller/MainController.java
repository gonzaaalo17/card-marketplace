package ch.supsi.web.cardmarketplace.controller;

import ch.supsi.web.cardmarketplace.model.Card;
import ch.supsi.web.cardmarketplace.service.CardService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    private final CardService cardService;

    public MainController(CardService cardService) {
        this.cardService = cardService;
    }

    // Endpoint to home page
    @GetMapping("/")
    public String showHome() {
        return "home";
    }

    // Endpoint to search page
    @GetMapping("/search")
    public String showSearch() {
        return "search";
    }

    // Endpoint to about page
    @GetMapping("/about")
    public String showAbout() {
        return "about";
    }

    // Endpoint to contact page
    @GetMapping("/contact")
    public String showContact() {
        return "contact";
    }

    // Endpoint to sell card form
    @GetMapping("/card/new")
    public String showSellCard() {
        return "sell";
    }
}
