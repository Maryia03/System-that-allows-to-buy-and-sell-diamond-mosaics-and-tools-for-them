package pl.pollub.mosaic.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.List;

@Getter
@Entity
@RequiredArgsConstructor
public class Users {
    @Id
    @GeneratedValue
    private Integer id;
    @Setter @NonNull
    private String name;
    @Setter @NonNull
    private String email;
    @Setter @NonNull @JsonIgnore
    private String password;
    @Setter @NonNull
    private String phone;
    @Setter @NonNull
    private String address;
    @Setter @Getter
    private Role role = Role.CUSTOMER;
    @Setter @Getter
    private boolean isAcive = true;
    @Setter
    @OneToMany
    List<Orders> ordersList;

    public Users(Users users) {
        this.id = users.getId();
        this.name = users.getName();
        this.email = users.getEmail();
        this.password = users.getPassword();
        this.role = users.getRole();
        this.ordersList = users.getOrdersList();
    }

    public Users() {
    }

}
