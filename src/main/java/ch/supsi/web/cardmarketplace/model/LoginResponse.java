package ch.supsi.web.cardmarketplace.model;

public class LoginResponse {
    /**
     * This class is to return user together with token, so that it can be stored in LocalStorage 
     * and username in sell.html form is utofilled
    */

    private String token;
    private String username;

    public LoginResponse(String token, String user) {
        this.token = token;
        this.username = user;
    }

    public String getToken() { return token; }
    public String getUser() { return username; }
}