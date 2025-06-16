package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "PACIENTE")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Paciente {
    /**
     * Grupos de validação para cenários de criação e atualização.
     */
    public interface CriarPaciente {
    }

    public interface AtualizarPaciente {
    }

    /**
     * Nome da tabela no banco de dados.
     */
    public static final String TABLE_NAME = "PACIENTE";

    /**
     * Chave primária gerada automaticamente pelo banco.
     * Coluna: IDPACIENTE
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "IDPACIENTE")
    private Long idPaciente;

    /**
     * Referência à pessoa física associada (ID_PESSOAFIS).
     * Obrigatório em criação e atualização.
     */
    @NotNull(message = "Pessoa Física é obrigatória", groups = {CriarPaciente.class, AtualizarPaciente.class})
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PESSOAFIS", referencedColumnName = "IDPESSOAFIS")
    private PessoaFis pessoaFis;

    /**
     * Registro geral do paciente.
     * Deve ser único, não nulo e ter entre 5 e 15 caracteres.
     * Coluna: RGPACIENTE
     */
    @NotBlank(message = "R.G. não pode ser vazio", groups = { CriarPaciente.class, AtualizarPaciente.class })
    @Size(min = 5, max = 15, message = "R.G. deve ter entre 5 e 15 caracteres", groups = { CriarPaciente.class,
            AtualizarPaciente.class })
    @Column(name = "RGPACIENTE", length = 15, nullable = false, unique = true)
    private String rgPaciente;

    /**
     * Estado de origem do registro.
     * Opcional; se presente deve ter exatamente 2 caracteres.
     * Coluna: ESTDORGPAC
     */
    @Size(min = 2, max = 2, message = "Estado deve ter 2 caracteres", groups = { CriarPaciente.class,
            AtualizarPaciente.class })
    @Column(name = "ESTDORGPAC", length = 2)
    private String estdOrgPac;

    /**
     * Indica se o paciente está ativo.
     * Padrão no banco: TRUE.
     * Coluna: STATUSPAC
     */
    @NotNull(message = "Status do paciente é obrigatório", groups = { CriarPaciente.class, AtualizarPaciente.class })
    @Column(name = "STATUSPAC", nullable = false)
    private Boolean statusPac;

}
