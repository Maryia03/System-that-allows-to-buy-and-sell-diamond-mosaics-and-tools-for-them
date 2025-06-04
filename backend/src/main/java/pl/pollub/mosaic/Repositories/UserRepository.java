package pl.pollub.mosaic.Repositories;

import org.springframework.data.repository.CrudRepository;

import pl.pollub.mosaic.Models.Users;

import java.util.Optional;


public interface UserRepository extends CrudRepository<Users, Integer> {
    Optional<Users> findByName(String name);
    Optional<Users> findByEmail(String email);

}