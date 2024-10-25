package com.chatapp.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity()
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    int id;

    @Column(name = "name", columnDefinition = "VARCHAR(255)", nullable = false)
    String name;

    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    List<User> users = new ArrayList<>();

    @PreRemove
    private void preRemove(){
        users.forEach(user -> user.setRole(null));
    }
}
