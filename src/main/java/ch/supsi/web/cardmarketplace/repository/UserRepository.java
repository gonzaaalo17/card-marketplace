package ch.supsi.web.cardmarketplace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ch.supsi.web.cardmarketplace.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByUsernameOrEmail(String username, String email);

    Optional<User> findByUsernameAndPassword(String username, String password);
}
