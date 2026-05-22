package ch.supsi.web.cardmarketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ch.supsi.web.cardmarketplace.model.Card;

public interface CardRepository extends JpaRepository<Card, Long>, JpaSpecificationExecutor<Card> {
    // Takes model/entity to manage and its PK's data type -> Applies CRUD methods:
    /**
    * save()
    * findAll()
    * findById()
    * deleteById()
    * count()
     */
    
    List<Card> findTop3ByOrderByCreatedDateDesc();
}
