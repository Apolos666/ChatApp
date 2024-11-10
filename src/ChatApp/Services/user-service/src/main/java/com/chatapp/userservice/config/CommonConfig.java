package com.chatapp.userservice.config;

import com.cloudinary.Cloudinary;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.yaml.snakeyaml.Yaml;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Configuration
@PropertySources({
    @PropertySource(value = "classpath:cloudinary-credentials.yml", factory = YamlPropertySourceFactory.class)
})
public class CommonConfig {
    @Autowired
    private CloudinaryConfig cloudinaryConfig;

    @Bean
    public ModelMapper modelMapper(){
        ModelMapper mapper=new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return mapper;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public Cloudinary cloudinary(){
        Map<String, Object> config = new HashMap<>();
        config.put("cloud_name", cloudinaryConfig.getCloudName());
        config.put("api_key", cloudinaryConfig.getApiKey());
        config.put("api_secret", cloudinaryConfig.getApiSecret());
        config.put("secure", true);

        return new Cloudinary(config);
    }
}
