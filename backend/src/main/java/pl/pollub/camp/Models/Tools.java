package pl.pollub.camp.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter@Setter
public class Tools{
    @Id
    @GeneratedValue
    private int Id;
    private String name;
    private String Description;
    private String imageLink;
    private Double price;
}
