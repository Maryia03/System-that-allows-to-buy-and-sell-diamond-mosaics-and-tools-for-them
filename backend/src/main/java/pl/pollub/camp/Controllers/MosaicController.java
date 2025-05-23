package pl.pollub.camp.Controllers;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.pollub.camp.Models.Mosaics;
import pl.pollub.camp.Services.MosaicService;
import pl.pollub.camp.Repositories.MosaicRepository;
import pl.pollub.camp.Models.DTO.MosaicRequest;

import java.util.Optional;

@Controller
@RequestMapping(path = "/mosaic")
@CrossOrigin
public class MosaicController {
    @Autowired
    private MosaicService mosaicService;

    @PostMapping(path = "/add")
    public @ResponseBody String addMosaic(HttpServletRequest request,@RequestBody MosaicRequest mosaicRequest) {
        try {
            return mosaicService.addMosaic(request,mosaicRequest);
        } catch (IllegalArgumentException e) {
            return e.getMessage();
        }
    }
    @GetMapping(path = "/all")
    public @ResponseBody Iterable<Mosaics> getAllMosaics() {
        return mosaicService.getAllMosaics();
    }
    @GetMapping(path = "/id/{id}")
    public @ResponseBody Optional<Mosaics> getMosaicById(@PathVariable int id){
        return mosaicService.getById(id);
    }

    @DeleteMapping(path = "/delete/{id}")
    public @ResponseBody String deleteMosaic(@PathVariable int id) {
        try {
            return mosaicService.deleteMosaic(id);
        } catch (EntityNotFoundException e) {
            return e.getMessage();
        }
    }

    @PatchMapping(path = "/update/{id}")
    public @ResponseBody String updateMosaic(@PathVariable int id, @RequestBody MosaicRequest updatedMosaicRequest) {
        try {
            Mosaics updatedMosaic = mosaicService.updateMosaic(id, updatedMosaicRequest);
            return "Mosaic updated: " + updatedMosaic.getName();
        } catch (EntityNotFoundException e) {
            return e.getMessage();
        }
    }
}
