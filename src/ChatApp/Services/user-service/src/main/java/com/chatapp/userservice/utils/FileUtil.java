package com.chatapp.userservice.utils;

import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

public class FileUtil {
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = Arrays.asList(
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif"
    );

    public static boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && ALLOWED_IMAGE_EXTENSIONS.contains(contentType.toLowerCase());
    }

    public static boolean isValidFileSize(MultipartFile file, long maxSizeInMB) {
        return (file.getSize() / (1024 * 1024)) <= maxSizeInMB;
    }
} 