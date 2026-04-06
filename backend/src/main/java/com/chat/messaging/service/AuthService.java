package com.chat.messaging.service;

import com.chat.messaging.dto.AuthResponse;
import com.chat.messaging.dto.LoginRequest;
import com.chat.messaging.dto.RegisterRequest;
import com.chat.messaging.entity.User;
import com.chat.messaging.respository.UserRepository;
import com.chat.messaging.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private  final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }
        User user= User.builder()
                .username(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .status("OFFLINE")
                .lastSeen(LocalDateTime.now())
                .build();
        userRepository.save(user);
        String token =jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token= jwtUtil.generateToken(request.getEmail());
        return new AuthResponse(token);
    }
}
