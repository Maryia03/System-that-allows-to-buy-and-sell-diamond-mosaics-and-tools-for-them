package pl.pollub.mosaic.Controllers;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpServerErrorException;
import pl.pollub.mosaic.Models.Role;
import pl.pollub.mosaic.Repositories.UserRepository;
import pl.pollub.mosaic.Models.Users;
import pl.pollub.mosaic.Services.JwtService;

import java.util.Optional;
import java.util.SimpleTimeZone;

@Controller
@RequestMapping(path = "/user")
@CrossOrigin
public class UserController {
    @Autowired
    private UserRepository userRepository;
    private PasswordEncoder encoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;

    @PostMapping(path = "/add")
    public @ResponseBody String addUser(@RequestParam String name, @RequestParam String password, @RequestParam String email){
        Users u = new Users();
        u.setName(name);
        u.setPassword(encoder.encode(password));

        u.setEmail(email);
        u.setRole(Role.CUSTOMER);
        userRepository.save(u);
        return "User succesfully created";
    }

    @GetMapping(path = "/all")
    public @ResponseBody Iterable<Users> getAllUsers(){
            return userRepository.findAll();
    }
    @DeleteMapping(path = "/delete")
    public @ResponseBody String deleteUser(@RequestParam int id){
        userRepository.deleteById(id);
        return "User succesfully deleted";
    }

    @PatchMapping(path = "/update")
    public @ResponseBody String updateUser(@RequestParam(required = false) String name, @RequestParam int id){
        Users u = userRepository.findById(id).orElse(null);
        if(u!=null){
            u.setName(name);
            userRepository.save(u);
            return u.getName();
        }
        return "User not found";
    }

    @GetMapping("/block/{id}")
    public @ResponseBody String blockUser(@PathVariable int id) {
        Optional<Users> u = userRepository.findById(id);
        if (u.isPresent()) {
            u.get().setAcive(!u.get().isAcive());
            userRepository.save(u.get());
            return "Success";
        }
        throw new EntityNotFoundException("user not found");
    }
}
