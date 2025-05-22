package pl.pollub.camp.Repositories;

import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.repository.CrudRepository;
import pl.pollub.camp.Models.Tools;

public interface ToolRepository extends CrudRepository<Tools, Integer> {

}