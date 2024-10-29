package com.chatapp.userservice.service;

import com.chatapp.userservice.dto.auth.request.*;
import com.chatapp.userservice.dto.auth.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    String changePassword(int id, PasswordModifyRequest request);

    String registerAccount(RegistrationRequest request);

    String activateAccount(ActivationAccountRequest request);

    String resetPassword(ResetPasswordRequest request);

    String resetPasswordForUser(ResetPasswordForUserRequest request);
}
