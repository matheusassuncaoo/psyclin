package com.br.psyclin.models;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoProfissionalConverter implements AttributeConverter<Profissional.TipoProfissional, String> {
    @Override
    public String convertToDatabaseColumn(Profissional.TipoProfissional tipo) {
        return tipo == null ? null : tipo.getValue();
    }

    @Override
    public Profissional.TipoProfissional convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return Profissional.TipoProfissional.fromValue(dbData);
    }
} 