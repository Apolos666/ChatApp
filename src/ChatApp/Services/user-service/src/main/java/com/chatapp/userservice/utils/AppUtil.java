package com.chatapp.userservice.utils;

import com.chatapp.userservice.dto.ObjectResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

public class AppUtil {

    public static Pageable createPageable(int pageSize, int pageNumber, String sortDir, String sortBy){
        Sort sort = Sort.by(sortBy);

        if(sortDir.equalsIgnoreCase(Sort.Direction.ASC.toString())){
            sort.ascending();
        }else {
            sort.descending();
        }

        Pageable pageable = PageRequest.of(pageNumber-1, pageSize, sort);

        return pageable;
    }

    public static <P, C> ObjectResponse createObjectResponse(Page<P> pageContent, List<C> dtoContent){
        ObjectResponse<C> response = new ObjectResponse();

        response.builder()
                .totalElements(pageContent.getTotalElements())
                .totalPages(pageContent.getTotalPages())
                .pageSize(pageContent.getSize())
                .pageNumber(pageContent.getNumber()+1)
                .isLast(pageContent.isLast())
                .build();

        response.setContent(dtoContent);

        return response;
    }

}
