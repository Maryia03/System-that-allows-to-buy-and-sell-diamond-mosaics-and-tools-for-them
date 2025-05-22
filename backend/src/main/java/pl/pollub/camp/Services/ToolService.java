package pl.pollub.camp.Services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.camp.Models.Tools;
import pl.pollub.camp.Repositories.ToolRepository;

import java.util.Optional;
@Service
@NoArgsConstructor
public class ToolService {
    @Autowired
    private ToolRepository toolRepository;

    public String addTool(HttpServletRequest request, ToolRequest toolRequest) {
        Tools tool = new Tools();
        tool.setName(toolRequest.getName());
        tool.setDescription(toolRequest.getDescription());
        tool.setImageLink(toolRequest.getImageLink());
        tool.setPrice(toolRequest.getPrice());

        toolRepository.save(tool);
        return "Tool added successfully";
    }

    public String deleteTool(int id) {
        if (!toolRepository.existsById(id)) {
            throw new EntityNotFoundException("Tool not found with id " + id);
        }
        toolRepository.deleteById(id);
        return "Tool deleted successfully";
    }

    public Tools updateTool(int id, ToolRequest updatedToolRequest) {
        Tools tool = toolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tool not found with id " + id));

        tool.setName(updatedToolRequest.getName());
        tool.setDescription(updatedToolRequest.getDescription());
        tool.setImageLink(updatedToolRequest.getImageLink());
        tool.setSize(updatedToolRequest.getSize());
        tool.setPrice(updatedToolRequest.getPrice());

        return toolRepository.save(tool);
    }

    public Iterable<Tools> getAllTools() {
        return toolRepository.findAll();
    }
    public Optional<Tools> getById(int id) {
        return toolRepository.findById(id);
    }
}