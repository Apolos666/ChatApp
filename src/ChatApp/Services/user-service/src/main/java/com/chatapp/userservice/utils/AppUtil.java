package com.chatapp.userservice.utils;

import com.chatapp.userservice.constant.AppConstant;
import com.chatapp.userservice.dto.ObjectResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
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

    public static String generateRandomPassword(int length){
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(10);

        String upperChars = AppConstant.PASSWORD_CHARACTERS_UPPER;
        String lowerChars = AppConstant.PASSWORD_CHARACTERS_LOWER;
        String digits = AppConstant.PASSWORD_CHARACTERS_DIGIT;
        String specialChars = AppConstant.PASSWORD_CHARACTERS_SPECIAL;
        String allChars = AppConstant.PASSWORD_ALL_CHARACTERS;

        password.append(upperChars.charAt(random.nextInt(upperChars.length())));
        password.append(lowerChars.charAt(random.nextInt(lowerChars.length())));
        password.append(digits.charAt(random.nextInt(digits.length())));
        password.append(specialChars.charAt(random.nextInt(specialChars.length())));

        for (int i = 4; i<length;i++){
            password.append(allChars.charAt(random.nextInt(allChars.length())));
        }


        String shuffledPassword = shuffleString(password.toString());

        return shuffledPassword;

    }


    private static String shuffleString(String password){
        List<Character> characters = new ArrayList<>();
        for (char c: password.toCharArray()){
            characters.add(c);
        }

        Collections.shuffle(characters);

        StringBuilder shuffledString = new StringBuilder();
        for (char c : characters) {
            shuffledString.append(c);
        }

        return shuffledString.toString();
    }

}
