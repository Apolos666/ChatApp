package com.chatapp.userservice.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ObjectResponse <T>{
    long totalElements;
    int totalPages;
    int pageSize;
    int pageNumber;
    boolean isLast;
    List<T> content;
}
