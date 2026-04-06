package com.chat.messaging.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue
    @UuidGenerator
    @EqualsAndHashCode.Include
    @Column(updatable = false, nullable = false)
    UUID id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
//
    private String status;
//
    private LocalDateTime lastSeen;

    @OneToMany(mappedBy = "sender" , cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Message> messages;

    @ManyToMany(mappedBy = "participants")
    @JsonIgnore
    private Set<Chatroom> chatrooms;

}
