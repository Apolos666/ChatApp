package com.chatapp.userservice.validator.user;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.temporal.ChronoUnit;
import java.sql.Date;
import java.util.Objects;
import java.time.LocalDate;


public class DobValidator implements ConstraintValidator<DobConstraint, Date> {

    int minAge;

    @Override
    public void initialize(DobConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        minAge=constraintAnnotation.min();
    }

    @Override
    public boolean isValid(Date value, ConstraintValidatorContext context) {
        if(Objects.isNull(value))
            return false;

        return ChronoUnit.YEARS.between(value.toLocalDate(), LocalDate.now()) >= minAge;
    }
}
