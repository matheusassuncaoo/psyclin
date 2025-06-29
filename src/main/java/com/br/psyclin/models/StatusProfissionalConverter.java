package com.br.psyclin.models;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StatusProfissionalConverter implements AttributeConverter<Profissional.StatusProfissional, String> {
    @Override
    public String convertToDatabaseColumn(Profissional.StatusProfissional status) {
        return status == null ? null : status.getValue();
    }

    @Override
    public Profissional.StatusProfissional convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return Profissional.StatusProfissional.fromValue(dbData);
    }
} 