package pl.pollub.mosaic.Controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.mosaic.Models.DTO.LoginRequest;
import pl.pollub.mosaic.Models.DTO.RegisterRequest;
import pl.pollub.mosaic.Services.AuthService;

@RestController
@RequestMapping(path = "/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {
    private final AuthService authService;

    @PostMapping(path = "/register")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void register(@RequestBody RegisterRequest registerRequest){
        authService.register(registerRequest);
    }
    @PostMapping(path = "/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(authService.login(loginRequest));
    }
}
