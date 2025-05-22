package pl.pollub.camp.DTO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data@Getter@Setter
public class ToolsRequest {
    private int id;
    private String name;
    private String description;
    private String imageLink;
    private Double price;
}
