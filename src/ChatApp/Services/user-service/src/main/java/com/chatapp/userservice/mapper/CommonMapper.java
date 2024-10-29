package com.chatapp.userservice.mapper;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class CommonMapper {

    private ModelMapper modelMapper;

    public <E,D> E convertDtoToEntity(D dto, Class<E> eClass){
        return modelMapper.map(dto, eClass);
    }

    public <E,D> D convertEntityToDto(E entity, Class<D> dClass){
        return modelMapper.map(entity, dClass);
    }

}
