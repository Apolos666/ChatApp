package com.chatapp.userservice.enums;

public enum MessageStatusEnum{
    SEEN("Seen"),
    DELIVERED("Delivered"),
    FAILED("Failed"),
    DELETED("Deleted"),
    PENDING("Pending")
    ;
    private String value;

    MessageStatusEnum(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}