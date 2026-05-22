package ch.supsi.web.cardmarketplace.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String vendor;

    private double price;

    private String rarity;

    /**
     * The problem here was that condition and date are reserved keywords in MySQLite
     * So had to change variable names to the onbes right now
     * But on serialization in frontend takes these names, but expects condition and data, not
     * cardCondition and createdDate, so when converting to JSON, previous names have to be kept.
     */
    @JsonProperty("condition") // This is done because of the variable names in frontend
    private String cardCondition;

    private String collection;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String image;

    @JsonProperty("date") // This is done because of the variable names in frontend
    private LocalDateTime createdDate;
}