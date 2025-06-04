package pl.pollub.mosaic.Models.DTO;

import lombok.Getter;

@Getter
public class LoginRequest {
    private String email;
    private String password;
}
