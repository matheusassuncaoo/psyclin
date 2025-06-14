package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(name = "ANAMNESE")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Anamnese {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDANAMNESE")
    @EqualsAndHashCode.Include
    private Long idAnamnese;

    @NotNull(message = "Paciente é obrigatório")
    @Column(name = "ID_PACIENTE", nullable = false)
    private Long idPaciente;

    @NotNull(message = "Profissional é obrigatório")
    @Column(name = "ID_PROFISSIO", nullable = false)
    private Long idProfissional;

    @NotNull(message = "Data da anamnese é obrigatória")
    @Column(name = "DATAANAM", nullable = false)
    private LocalDateTime dataAnamnese;

    @Size(max = 100, message = "Nome do responsável deve ter no máximo 100 caracteres")
    @Column(name = "NOMERESP", length = 100)
    private String nomeResponsavel;

    @Size(min = 11, max = 11, message = "CPF deve conter 11 caracteres")
    @Column(name = "CPFRESP", length = 11)
    private String cpfResponsavel;

    @NotNull(message = "Autorização de visibilidade é obrigatória")
    @Column(name = "AUTVISIB", nullable = false)
    private Boolean autorizacaoVisibilidade;

    @NotNull(message = "Status da anamnese é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUSANM", nullable = false)
    private StatusAnamnese statusAnamnese;

    @NotNull(message = "Status funcional é obrigatório")
    @Column(name = "STATUSFUNC", nullable = false)
    private Boolean statusFuncional;

    @Column(name = "OBSERVACOES", columnDefinition = "TEXT")
    private String observacoes;

    public enum StatusAnamnese {
        APROVADO,
        REPROVADO,
        CANCELADO
    }
}
