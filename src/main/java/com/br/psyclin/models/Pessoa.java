package com.br.psyclin.models;

// Jakarta Persistence
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Jakarta Validation
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// Lombok
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Representa a entidade PESSOA do sistema.
 * Mapeado para a tabela PESSOA no banco de dados.
 */
@Data
@Entity
@Table(name = "PESSOA")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Pessoa {

    public interface CriarPessoa {}
    public interface AtualizarPessoa {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "IDPESSOA")
    private Long idPessoa;

    @NotNull(message = "Tipo de pessoa é obrigatório", groups = {CriarPessoa.class, AtualizarPessoa.class})
    @Enumerated(EnumType.STRING)
    @Column(name = "TIPOPESSOA", nullable = false, length = 1)
    private TipoPessoa tipoPessoa;

    public enum TipoPessoa { F, J }
} 