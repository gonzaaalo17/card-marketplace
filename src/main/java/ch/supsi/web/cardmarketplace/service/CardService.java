package ch.supsi.web.cardmarketplace.service;

import ch.supsi.web.cardmarketplace.model.Card;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CardService {

    private final List<Card> cards;
    private int nextId;

    public CardService() {
        this.cards = new ArrayList<>();
        this.nextId = 1;
    }

    public List<Card> getAllCards() {
        return cards;
    }

    public void addCard(Card card) {
        card.setId(nextId++);
        cards.add(card);
    }

    public List<Card> getLatest(int num) {
        List<Card> latest = new ArrayList<>();

        // Avoid crashing with small list
        for (int i = cards.size() - 1; i >= 0 && latest.size() < num; i--) {
            latest.add(cards.get(i));
        }
        return latest;
    }

    public List<Card> getPage(int offset, int limit) {
        List<Card> page = new ArrayList<>();

        // With min() we ensure to take page only if list size allows it
        for (int i = offset; i < Math.min(offset + limit, cards.size()); i++) {
            page.add(cards.get(i));
        }
        return page;
    }

    public Card getCardById(int id) {
        return cards.stream()
                .filter(c -> c.getId() == id)
                .findFirst()
                .orElse(null);
    }
}
