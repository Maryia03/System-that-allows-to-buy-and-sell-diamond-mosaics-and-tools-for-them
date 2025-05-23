package pl.pollub.camp.Services;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;
import pl.pollub.camp.Models.DTO.LoginRequest;
import pl.pollub.camp.Models.DTO.RegisterRequest;
import pl.pollub.camp.Models.Role;
import pl.pollub.camp.Models.Users;
import pl.pollub.camp.Repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    @Autowired
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public void register(RegisterRequest registerRequest){
      if(userRepository.findByEmail(registerRequest.getEmail()).orElse(null) == null) {
          Users u = new Users(registerRequest.getUsername(),
                  registerRequest.getEmail(),
                  bCryptPasswordEncoder.encode(registerRequest.getPassword()),
                  registerRequest.getPhone(),
                  registerRequest.getAddress());
          userRepository.save(u);
      }else{
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
      }

    }

    public String login(LoginRequest loginRequest){
        System.out.println(loginRequest.getEmail() + " " + loginRequest.getPassword());
        try{
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        }catch (Exception e){
            System.out.println(e);
            return "invalid user data";
        }
        Users u = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        System.out.println(u.getEmail());
        if(u.getRole() == Role.ADMIN)
            return "{ \"token\": \""+jwtService.generateToken(u)+"\", \"id\": \""+u.getId()+"\", \"admin\" : true}";
        else
            return "{ \"token\": \""+jwtService.generateToken(u)+"\", \"id\": \""+u.getId()+"\"}";
    }
}
