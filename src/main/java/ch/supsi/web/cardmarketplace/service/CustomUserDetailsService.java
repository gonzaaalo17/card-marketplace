package ch.supsi.web.cardmarketplace.service;

import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ch.supsi.web.cardmarketplace.model.User;
import ch.supsi.web.cardmarketplace.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    /**
     * Since our password is now encrypted, we need a mechanism to compare 
     * the password in Login to the one in DB when user logs in.
     * We also need to do the validation and see if user exists and password is correct.
     * For this we dont do the verification manually because we cant.
     * We use this framework config to retrieve the given username from DB and convert
     * it to sproing Security User object so that we can easily perform the validation in Service.
     * Spring Security will do it for us with just one command and we dont have to 
     * implement any logic.
     * 
     * Here we as basically retrieving user from DB and convert it to SS User object
     * If no user found raise Exception and frontend displays message.
     * On login, Spring automatically calls loasUserByUsername first
     */

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            AuthorityUtils.createAuthorityList(user.getRole())
        );
    }
}
