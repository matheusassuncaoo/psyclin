package com.br.psyclin.models;

// Jakarta Persistence
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Jakarta Validation
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// Lombok
import lombok.Data;
import lombok.EqualsAndHashCode;

// Java Time
import java.time.LocalDateTime;

/**
 * Representa a entidade ANAMNESE do sistema.
 * Mapeado para a tabela ANAMNESE no banco de dados.
 */
@Data
@Entity
@Table(name = "ANAMNESE")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Anamnese {
    /**
     * Grupos de validação para cenários de criação e atualização.
     */
    public interface CriarAnamnese {}
    public interface AtualizarAnamnese {}

    /**
     * Nome da tabela no banco de dados.
     */
    public static final String TABLE_NAME = "ANAMNESE";

    /**
     * Chave primária gerada automaticamente pelo banco.
     * Coluna: IDANAMNESE
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "IDANAMNESE")
    private Long idAnamnese;

    /**
     * Referência ao paciente associado.
     * Obrigatório em criação e atualização.
     * Coluna: ID_PACIENTE
     */
    @NotNull(message = "Paciente é obrigatório", groups = {CriarAnamnese.class, AtualizarAnamnese.class})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PACIENTE", referencedColumnName = "IDPACIENTE")
    private Paciente paciente;


    /**
     * Referência ao profissional que realizou a anamnese.
     * Obrigatório em criação e atualização.
     * Coluna: ID_PROFISSIO
     */
    @NotNull(message = "Profissional é obrigatório", groups = {CriarAnamnese.class, AtualizarAnamnese.class})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PROFISSIO", referencedColumnName = "IDPROFISSIO")
    private Profissional profissional;

    /**
     * Data e hora em que a anamnese foi realizada.
     * Obrigatório em criação e atualização.
     * Coluna: DATAANAM
     */
    @NotNull(message = "Data da anamnese é obrigatória", groups = {CriarAnamnese.class, AtualizarAnamnese.class})
    @Column(name = "DATAANAM", nullable = false)
    private LocalDateTime dataAnamnese;

    /**
     * Nome do responsável pelo paciente.
     * Opcional; se preenchido, deve ter até 100 caracteres.
     * Coluna: NOMERESP
     */
    @Size(max = 100, message = "Nome do responsável deve ter no máximo 100 caracteres", groups = {CriarAnamnese.class, AtualizarAnamnese.class})
    @Column(name = "NOMERESP", length = 100)
    private String nomeResponsavel;

    /**
     * CPF do responsável pelo paciente.
     * Opcional; se preenchido, deve ter exatamente 11 dígitos.
     * Coluna: CPFRESP
     */
    @Size(min = 11, max = 11, message = "CPF deve conter 11 caracteres", groups = {CriarAnamnese.class, AtualizarAnamnese.class})
    @Column(name = "CPFRESP", length = 11)
    private String cpfResponsavel;

    /**
     * Autoriza visibilidade pública da anamnese.
     * Obrigatório em criação e atualização.
     * Coluna: AUTVISIB
     */
    @NotNull(message = "Autorização de visibilidade é obrigatória", groups = {CriarAnamnese.class, AtualizarAnamnese.class})
    @Column(name = "AUTVISIB", nullable = false)
    private Boolean autorizacaoVisibilidade;

    /**
     * Status de aprovação da anamnese.
     * Obrigatório em criação e atualização.
     * Enum: APROVADO, REPROVADO, CANCELADO
     * Coluna: STATUSANM
     */
    @NotNull(message = "Status da anamnese é obrigatório", groups = {CriarAnamnese.class, AtualizarAnamnese.class})
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUSANM", nullable = false)
    private StatusAnamnese statusAnamnese;

    /**
     * Indica se a anamnese está funcional.
     * Obrigatório em criação e atualização.
     * Coluna: STATUSFUNC
     */
    @NotNull(message = "Status funcional é obrigatório", groups = {CriarAnamnese.class, AtualizarAnamnese.class})
    @Column(name = "STATUSFUNC", nullable = false)
    private Boolean statusFuncional;

    /**
     * Observações adicionais.
     * Opcional; mapeado como TEXT no banco.
     * Coluna: OBSERVACOES
     */
    @Column(name = "OBSERVACOES", columnDefinition = "TEXT")
    private String observacoes;

    /**
     * Enum representando os possíveis status de anamnese.
     */
    public enum StatusAnamnese {
        APROVADO,
        REPROVADO,
        CANCELADO
    }
}
