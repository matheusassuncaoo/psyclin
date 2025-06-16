package com.br.psyclin.models;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Representa a entidade PROFISSIONAL do sistema.
 * Mapeado para a tabela PROFISSIONAL no banco de dados.
 */
@Data
@Entity
@Table(name = "PROFISSIONAL")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Profissional {
    /**
     * Grupos de validação para cenários de criação e atualização.
     */
    public interface CriarProfissional {
    }

    public interface AtualizarProfissional {
    }

    /**
     * Nome da tabela no banco de dados.
     */
    public static final String TABLE_NAME = "PROFISSIONAL";

    /**
     * Chave primária gerada automaticamente pelo banco.
     * Coluna: IDPROFISSIO
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "IDPROFISSIO")
    private Long idProfissio;

    /**
     * Referência à pessoa física associada (ID_PESSOAFIS).
     * Obrigatório em criação e atualização.
     */
    @NotNull(message = "Pessoa Física é obrigatória", groups = {CriarProfissional.class, AtualizarProfissional.class})
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PESSOAFIS", referencedColumnName = "IDPESSOAFIS")
    private PessoaFis pessoaFis;

    /**
     * Tipo do profissional.
     * Valores: '1','2','3','4'.
     * Obrigatório em criação e atualização.
     * Coluna: TIPOPROFI
     */
    @NotNull(message = "Tipo de profissional é obrigatório", groups = { CriarProfissional.class,
            AtualizarProfissional.class })
    @Enumerated(EnumType.STRING)
    @Column(name = "TIPOPROFI", length = 1, nullable = false)
    private TipoProfissional tipoProfi;

    /**
     * Identificador do supervisor (ID_SUPPROFI).
     * Opcional; pode ser nulo.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_SUPPROFI", referencedColumnName = "IDPROFISSIO")
    private Profissional supervisor;

    /**
     * Status do profissional.
     * Valores: '1','2','3'.
     * Opcional; se presente deve ser válido.
     * Coluna: STATUSPROFI
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUSPROFI", length = 1)
    private StatusProfissional statusProfi;

    /**
     * Conselho profissional (ID_CONSEPROFI).
     * Obrigatório em criação e atualização.
     */
    @NotNull(message = "ConseProfi é obrigatório", groups = {CriarProfissional.class, AtualizarProfissional.class})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CONSEPROFI", referencedColumnName = "IDCONSEPROFI")
    private Conseprofi conseprofi;

    /**
     * Enum para tipos de profissional.
     */
    public enum TipoProfissional {
        ADMINISTRATIVO("1"),
        TECNICO_BASICO("2"),
        TECNICO_SUPERIOR("3"),
        ADMINISTRADOR_MASTER("4");

        private final String code;

        TipoProfissional(String code) {
            this.code = code;
        }

        public String getCode() {
            return code;
        }
    }

    /**
     * Enum para status do profissional.
     */
    public enum StatusProfissional {
        ATIVO("1"),
        INATIVO("2"),
        SUSPENSO("3");

        private final String code;

        StatusProfissional(String code) {
            this.code = code;
        }

        public String getCode() {
            return code;
        }
    }

}
