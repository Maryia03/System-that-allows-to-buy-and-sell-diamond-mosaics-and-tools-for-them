package pl.pollub.mosaic.Models.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class ToolRequest {
    private int id;
    private String name;
    private String description;
    private String imageLink;
    private Double price;
}
