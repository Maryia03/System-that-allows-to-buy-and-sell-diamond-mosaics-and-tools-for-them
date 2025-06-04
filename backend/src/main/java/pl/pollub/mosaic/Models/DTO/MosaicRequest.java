package pl.pollub.mosaic.Models.DTO;

import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;
import pl.pollub.mosaic.Models.*;

import java.util.List;
@Getter@Setter
public class MosaicRequest {
        private String name;
        private String Description;
        private String imageLink;
        private String size;
        private Double price;
}
