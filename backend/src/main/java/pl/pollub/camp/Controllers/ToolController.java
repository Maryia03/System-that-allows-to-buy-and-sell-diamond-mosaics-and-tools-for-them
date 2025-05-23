package pl.pollub.camp.Controllers;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.pollub.camp.Models.Tools;
import pl.pollub.camp.Services.ToolService;
import pl.pollub.camp.Repositories.ToolRepository;
import pl.pollub.camp.Models.DTO.ToolRequest;

import java.util.Optional;

@Controller
@RequestMapping(path = "/tool")
@CrossOrigin
public class ToolController {
    @Autowired
    private ToolService toolService;

    @PostMapping(path = "/add")
    public @ResponseBody String addTool(HttpServletRequest request,@RequestBody ToolRequest toolRequest) {
        try {
            return toolService.addTool(request,toolRequest);
        } catch (IllegalArgumentException e) {
            return e.getMessage();
        }
    }
    @GetMapping(path = "/all")
    public @ResponseBody Iterable<Tools> getAllTools() {
        return toolService.getAllTools();
    }
    @GetMapping(path = "/id/{id}")
    public @ResponseBody Optional<Tools> getToolById(@PathVariable int id){
        return toolService.getById(id);
    }

    @DeleteMapping(path = "/delete/{id}")
    public @ResponseBody String deleteTool(@PathVariable int id) {
        try {
            return toolService.deleteTool(id);
        } catch (EntityNotFoundException e) {
            return e.getMessage();
        }
    }

    @PatchMapping(path = "/update/{id}")
    public @ResponseBody String updateTool(@PathVariable int id, @RequestBody ToolRequest updatedToolRequest) {
        try {
            Tools updatedTool = toolService.updateTool(id, updatedToolRequest);
            return "Tool updated: " + updatedTool.getName();
        } catch (EntityNotFoundException e) {
            return e.getMessage();
        }
    }
}
