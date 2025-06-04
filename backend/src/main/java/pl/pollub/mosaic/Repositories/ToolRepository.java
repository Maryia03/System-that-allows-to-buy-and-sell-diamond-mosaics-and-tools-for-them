package pl.pollub.mosaic.Repositories;

import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.repository.CrudRepository;
import pl.pollub.mosaic.Models.Tools;

public interface ToolRepository extends CrudRepository<Tools, Integer> {

}