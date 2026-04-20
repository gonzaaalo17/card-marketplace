package ch.supsi.web.cardmarketplace.model;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
public class Card {
    private int id;
    private String name;
    private String vendor;
    private double price;
    private String rarity;
    private String condition;
    private String collection;
    private String description;
    private LocalDateTime date;
    private String image;
}
