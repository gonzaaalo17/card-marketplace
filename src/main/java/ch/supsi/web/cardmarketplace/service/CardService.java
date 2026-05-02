package ch.supsi.web.cardmarketplace.service;

import ch.supsi.web.cardmarketplace.model.Card;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CardService {

    /**
     * Cache is created to not always repeat the filtering process on every filterinhg operation. Basically
     * if the data is unchanged, a cache will store current query, so data to frontend will be retrieved from 
     * cache instead of from doing whole operation, which is quicker.
     */
    private final Map<String, List<Card>> cache = new HashMap<>(); // query cache 
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

        cache.clear(); // If a new card is added invalidates cache
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

    public Map<String, Object> searchPaged(
        int page,
        int size,
        String name,
        String vendor,
        List<String> collections,
        List<String> conditions,
        String rarity, 
        String sort
    ) {

        Map<String, Object> result = new HashMap<>();
        String queryKey = buildKey(name, vendor, collections, conditions, rarity, sort);

        if (cache.containsKey(queryKey)) {
            // GEt data from cache
            int total = cache.get(queryKey).size();
            int start = page * size;
            int end = Math.min(start + size, total);
            List<Card> content = cache.get(queryKey).subList(start, end);

            result.put("content", content);
            result.put("totalElements", total);
            result.put("totalPages", (int) Math.ceil((double) total / size));
            result.put("currentPage", page);

        } else {
            List<Card> filtered = search(name, vendor, collections, conditions, rarity, sort);
            
            // Add data to cache
            cache.putIfAbsent(queryKey, List.copyOf(filtered)); // Store a copy of filtered

            int total = filtered.size();
            int start = page * size;
            int end = Math.min(start + size, total);

            List<Card> content = filtered.subList(start, end);

            result.put("content", content);
            result.put("totalElements", total);
            result.put("totalPages", (int) Math.ceil((double) total / size));
            result.put("currentPage", page);
        }

        return result;
    }
    
    // =====================================
    // Utility Methods
    // =====================================

    // Does the whole filtering operations in the list of cards and returns a new list
    private List<Card> search(
        String name,
        String vendor,
        List<String> collections,          
        List<String> conditions,
        String rarity,
        String sort
    ) {
        return cards.stream()
            .filter(c -> name == null || c.getName().toLowerCase().contains(name.toLowerCase()))

            .filter(c -> vendor == null || c.getVendor().toLowerCase().contains(vendor.toLowerCase()))

            .filter(c -> collections == null || collections.isEmpty() ||
                    collections.contains(c.getCollection()))

            .filter(c -> conditions == null || conditions.isEmpty() ||
                    conditions.contains(c.getCondition()))

            .filter(c -> rarity == null || c.getRarity().equalsIgnoreCase(rarity))

            .sorted((a, b) -> {
                if (sort == null) return 0;

                switch (sort) {
                    case "price":
                        return Double.compare(a.getPrice(), b.getPrice());
                    case "date":
                        return b.getDate().compareTo(a.getDate()); // newest first
                    case "rarity":
                        List<String> order = List.of("Common", "Uncommon", "Rare", "Ultra Rare");
                        return Integer.compare(
                            order.indexOf(a.getRarity()),
                            order.indexOf(b.getRarity())
                        );
                    default:
                        return 0;
                }
            }).toList();
    }

    // Creates a query key for the cache
    // If query is the same as key does not use search method and uses cache to deliver results
    private String buildKey(
        String name,
        String vendor,
        List<String> collections,
        List<String> conditions,
        String rarity,
        String sort
    ) {

        return String.join("|",
            normalize(name),
            normalize(vendor),
            normalizeList(collections),
            normalizeList(conditions),
            normalize(rarity),
            normalize(sort)
        );
    }

    // Helpers to manage order on conditions and collections
    private String normalize(String s) {
        return s == null ? "" : s.toLowerCase().trim();
    }

    private String normalizeList(List<String> list) {
        if (list == null || list.isEmpty()) return "";
        return list.stream()
            .map(String::toLowerCase)
            .sorted()
            .reduce((a,b) -> a + "," + b)
            .orElse("");
    }
}
