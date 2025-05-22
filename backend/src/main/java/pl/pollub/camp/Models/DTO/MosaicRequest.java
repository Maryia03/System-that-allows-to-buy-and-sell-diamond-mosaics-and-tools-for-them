package pl.pollub.camp.Models.DTO;

import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;
import pl.pollub.camp.Models.*;

import java.util.List;
@Getter@Setter
public class MosaicRequest {
        private String name;
        private String Description;
        private String imageLink;
        private String size;
        private Double price;
}
