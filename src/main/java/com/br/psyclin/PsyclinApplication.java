package com.br.psyclin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PsyclinApplication {

	public static void main(String[] args) {
		SpringApplication.run(PsyclinApplication.class, args);


	}

}
