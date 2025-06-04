package pl.pollub.mosaic.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/upload")
public class FileUploadController {
    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Upload JPG image (max 800x650)",
            description = "Accepts only JPG/JPEG files up to 5MB and max dimensions 800x650",
            responses = {
                    @ApiResponse(responseCode = "200", description = "File uploaded successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid file"),
                    @ApiResponse(responseCode = "500", description = "Server error")
            }
    )
    public ResponseEntity<String> uploadImage(
            @Parameter(
                    description = "JPG/JPEG image file (max 5MB, max 800x650)",
                    required = true,
                    content = @Content(mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
                            schema = @Schema(type = "string", format = "binary"))
            )
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String filename = file.getOriginalFilename();
            if (filename == null || !(filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg"))) {
                return ResponseEntity.badRequest().body("Only JPG files are allowed.");
            }

            BufferedImage image = ImageIO.read(file.getInputStream());
            if (image == null) {
                return ResponseEntity.badRequest().body("Invalid image file.");
            }
            if (image.getWidth() > 800 || image.getHeight() > 650) {
                return ResponseEntity.badRequest().body("Image dimensions must not exceed 800x650 pixels.");
            }

            Files.createDirectories(Paths.get(UPLOAD_DIR));

            String uniqueFilename = System.currentTimeMillis() + "_" + filename;
            Path path = Paths.get(UPLOAD_DIR + uniqueFilename);
            Files.write(path, file.getBytes());

            String fileUrl = "http://localhost:8080/files/" + uniqueFilename;
            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("File upload failed.");
        }
    }
}
