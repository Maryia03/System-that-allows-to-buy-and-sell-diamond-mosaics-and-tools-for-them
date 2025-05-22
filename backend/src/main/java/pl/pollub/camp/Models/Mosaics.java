package pl.pollub.camp.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter@Setter
public class Mosaics{
    @Id
    @GeneratedValue
    private int Id;
    private String name;
    private String Description;
    private String imageLink;
    private String size;
    private Double price;
}
