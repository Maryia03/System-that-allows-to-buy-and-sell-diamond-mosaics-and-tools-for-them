package pl.pollub.mosaic.Services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.mosaic.Models.DTO.MosaicRequest;
import pl.pollub.mosaic.Models.Mosaics;
import pl.pollub.mosaic.Repositories.MosaicRepository;

import java.util.Optional;

@Service
@NoArgsConstructor
public class MosaicService {
    @Autowired
    private MosaicRepository mosaicRepository;


    public String addMosaic(HttpServletRequest request, MosaicRequest mosaicRequest) {
        Mosaics mosaic = new Mosaics();
        mosaic.setName(mosaicRequest.getName());
        mosaic.setDescription(mosaicRequest.getDescription());
        mosaic.setImageLink(mosaicRequest.getImageLink());
        mosaic.setSize(mosaicRequest.getSize());
        mosaic.setPrice(mosaicRequest.getPrice());

        mosaicRepository.save(mosaic);
        return "Mosaic added successfully";
    }

    public String deleteMosaic(int id) {
        if (!mosaicRepository.existsById(id)) {
            throw new EntityNotFoundException("Mosaic not found with id " + id);
        }
        mosaicRepository.deleteById(id);
        return "Mosaic deleted successfully";
    }

    public Mosaics updateMosaic(int id, MosaicRequest updatedMosaicRequest) {
        Mosaics mosaic = mosaicRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Mosaic not found with id " + id));

        mosaic.setName(updatedMosaicRequest.getName());
        mosaic.setDescription(updatedMosaicRequest.getDescription());
        mosaic.setImageLink(updatedMosaicRequest.getImageLink());
        mosaic.setSize(updatedMosaicRequest.getSize());
        mosaic.setPrice(updatedMosaicRequest.getPrice());

        return mosaicRepository.save(mosaic);
    }

    public Iterable<Mosaics> getAllMosaics() {
        return mosaicRepository.findAll();
    }
    public Optional<Mosaics> getById(int id) {
        return mosaicRepository.findById(id);
    }
}