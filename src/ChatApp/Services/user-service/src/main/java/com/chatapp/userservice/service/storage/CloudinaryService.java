package com.chatapp.userservice.service.storage;

import com.chatapp.userservice.exception.ApiException;
import com.chatapp.userservice.utils.FileUtil;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        if (!FileUtil.isImageFile(file)) {
            throw new ApiException("Only image files (JPEG, PNG, GIF) are allowed", HttpStatus.BAD_REQUEST);
        }

        if (!FileUtil.isValidFileSize(file, 5)) { // 5MB
            throw new ApiException("File size must be less than 5MB", HttpStatus.BAD_REQUEST);
        }

        try {
            Map data = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return data.get("url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Cannot upload file");
        }
    }

    public boolean deleteFile(String avatarUrl) {
        try {
            String publicId = extractPublicIdFromUrl(avatarUrl);
            Map data = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            System.out.println(data);
            System.out.println(data.get("result").toString());
            return true;
        } catch (IOException e) {
            throw new RuntimeException("Cannot delete file");
        }
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        Pattern pattern = Pattern.compile("/upload/(?:v\\d+/)?([^/]+)\\.[^/]+$");
        Matcher matcher = pattern.matcher(imageUrl);
        if (matcher.find()) {
            return matcher.group(1);
        }
        throw new IllegalArgumentException("Invalid Cloudinary URL");
    }

}
