package com.br.psyclin.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Convert;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Entidade que representa um profissional de saúde no sistema.
 * Contém informações sobre tipo, status, supervisor e conselho profissional.
 * 
 * <p>Esta entidade está relacionada com {@link PessoaFisica} e possui
 * relacionamentos com {@link ConselhoProfissional} e {@link Especialidade}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "PROFISSIONAL")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Profissional {

    /**
     * Identificador único do profissional.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPROFISSIO")
    private Integer idProfissional;

    /**
     * Relacionamento com pessoa física.
     */
    @OneToOne
    @JoinColumn(name = "ID_PESSOAFIS", nullable = false, unique = true)
    @JsonBackReference
    private PessoaFisica pessoaFisica;

    /**
     * Tipo do profissional.
     */
    @Column(name = "TIPOPROFI", nullable = false)
    @Convert(converter = TipoProfissionalConverter.class)
    private TipoProfissional tipoProfissional;

    /**
     * Profissional supervisor (se aplicável).
     */
    @ManyToOne
    @JoinColumn(name = "ID_SUPPROFI")
    @JsonIgnore
    private Profissional supervisor;

    /**
     * Status do profissional.
     */
    @Column(name = "STATUSPROFI")
    @Convert(converter = StatusProfissionalConverter.class)
    private StatusProfissional statusProfissional;

    /**
     * Conselho profissional.
     */
    @ManyToOne
    @JoinColumn(name = "ID_CONSEPROFI", nullable = false)
    private ConselhoProfissional conselhoProfissional;

    /**
     * Lista de especialidades do profissional.
     */
    @ManyToMany
    @JoinTable(
        name = "PROFI_ESPEC",
        joinColumns = @JoinColumn(name = "ID_PROFISSIO"),
        inverseJoinColumns = @JoinColumn(name = "ID_ESPEC")
    )
    @JsonIgnore
    private List<Especialidade> especialidades;

    /**
     * Lista de profissionais subordinados.
     */
    @OneToMany(mappedBy = "supervisor")
    @JsonIgnore
    private List<Profissional> subordinados;

    /**
     * Enum para o tipo de profissional.
     */
    public enum TipoProfissional {
        _1("1"), _2("2"), _3("3"), _4("4");
        
        private final String value;
        
        TipoProfissional(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
        
        public static TipoProfissional fromValue(String value) {
            for (TipoProfissional tipo : values()) {
                if (tipo.value.equals(value)) {
                    return tipo;
                }
            }
            throw new IllegalArgumentException("Tipo de profissional inválido: " + value);
        }
    }

    /**
     * Enum para o status do profissional.
     */
    public enum StatusProfissional {
        _1("1"), _2("2"), _3("3");
        
        private final String value;
        
        StatusProfissional(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
        
        public static StatusProfissional fromValue(String value) {
            for (StatusProfissional status : values()) {
                if (status.value.equals(value)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Status de profissional inválido: " + value);
        }
    }
}