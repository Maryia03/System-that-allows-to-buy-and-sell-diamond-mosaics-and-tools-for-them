package pl.pollub.mosaic.Repositories;

import org.hibernate.query.Order;
import org.springframework.data.repository.CrudRepository;
import pl.pollub.mosaic.Models.Orders;
import pl.pollub.mosaic.Models.Users;
import java.util.List;

public interface OrderRepository extends CrudRepository<Orders, Integer> {
    List<Orders> findByUser(Users user);

}
