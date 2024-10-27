package com.chatapp.userservice.enums;

import lombok.Getter;

@Getter
public enum UserRoleEnum {
    ADMIN(1),
    MODERATE_USER(2),
    NORMAL_USER(3)
    ;
    private int roleId;

    UserRoleEnum(int roleId) {
        this.roleId = roleId;
    }

}
