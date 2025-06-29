package com.br.psyclin.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Entidade que representa um paciente no sistema.
 * Contém informações específicas do paciente como RG e estado emissor.
 * 
 * <p>Esta entidade está relacionada com {@link PessoaFisica} e possui
 * relacionamentos com {@link Anamnese} e {@link Prontuario}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "PACIENTE")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Paciente {

    /**
     * Identificador único do paciente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPACIENTE")
    private Integer idPaciente;

    /**
     * Relacionamento com pessoa física.
     */
    @OneToOne
    @JoinColumn(name = "ID_PESSOAFIS", nullable = false, unique = true)
    @JsonBackReference
    private PessoaFisica pessoaFisica;

    /**
     * Número do RG do paciente.
     */
    @Column(name = "RGPACIENTE", nullable = false, unique = true, length = 15)
    private String rgPaciente;

    /**
     * Estado emissor do RG.
     */
    @Column(name = "ESTDORGPAC")
    @Enumerated(EnumType.STRING)
    private EstadoRg estadoRg;

    /**
     * Status do paciente (ativo/inativo).
     */
    @Column(name = "STATUSPAC", nullable = false)
    private Boolean statusPaciente = true;

    /**
     * Lista de anamneses do paciente.
     */
    @OneToMany(mappedBy = "paciente")
    @JsonIgnore
    private List<Anamnese> anamneses;

    /**
     * Lista de prontuários do paciente.
     */
    @OneToMany(mappedBy = "paciente")
    @JsonIgnore
    private List<Prontuario> prontuarios;

    /**
     * Enum para os estados emissores do RG no Brasil.
     */
    public enum EstadoRg {
        AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO;
    }
}
