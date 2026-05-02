package ch.supsi.web.cardmarketplace.model;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String name;
    private String surname;
    private String username;
    private String email;
    private String password;
}
