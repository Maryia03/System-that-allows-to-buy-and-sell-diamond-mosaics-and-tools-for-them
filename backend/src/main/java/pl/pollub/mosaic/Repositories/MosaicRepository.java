package pl.pollub.mosaic.Repositories;

import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.repository.CrudRepository;
import pl.pollub.mosaic.Models.Mosaics;

import java.util.Collection;
import java.util.Optional;

public interface MosaicRepository extends CrudRepository<Mosaics, Integer> {
    Iterable<Mosaics> findByIdNotIn(Collection<Integer> integer);
}
