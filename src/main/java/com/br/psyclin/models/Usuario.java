package com.br.psyclin.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

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

/**
 * Representa a entidade de USUARIO do sistema.
 * Mapeado para a tabela USUARIO no banco de dados.
 */
@Data
@Entity
@Table(name = "USUARIO")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Usuario {

    /**
     * Grupos de validação para cenários de criação e atualização.
     */
    public interface CriarUsuario {}
    public interface AtualizarUsuario {}

    /**
     * Nome da tabela no banco de dados.
     */
    public static final String TABLE_NAME = "USUARIO";

    /**
     * Chave primária gerada automaticamente pelo banco.
     * Coluna: IDUSUARIO
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "IDUSUARIO")
    private Long idUsuario;

    /**
     * Referência ao profissional associado a este usuário.
     * Obrigatório em criação e atualização.
     * Chave estrangeira para a tabela PROFISSIONAL (IDPROFISSIO).
     */
     @NotNull(message = "Profissional é obrigatório", groups = {CriarUsuario.class, AtualizarUsuario.class})
     @OneToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "ID_PROFISSIO", referencedColumnName = "IDPROFISSIO")
     @JsonBackReference
     private Profissional profissional;

    /**
     * Nome de login usado para autenticação.
     * Deve ser único, não nulo e ter entre 5 e 100 caracteres.
     * Coluna: LOGUSUARIO
     */
    @NotBlank(message = "Login de usuário não pode ser vazio", groups = {CriarUsuario.class, AtualizarUsuario.class})
    @Size(min = 5, max = 100, message = "Login deve ter entre 5 e 100 caracteres", groups = {CriarUsuario.class, AtualizarUsuario.class})
    @Column(name = "LOGUSUARIO", length = 100, nullable = false, unique = true)
    private String loginUsuario;

    /**
     * Senha do usuário (armazenar sempre criptografada).
     * Obrigatória apenas na criação. Deve ter entre 8 e 250 caracteres.
     * Coluna: SENHAUSUA
     */
    @NotBlank(message = "Senha de usuário não pode ser vazia", groups = {CriarUsuario.class})
    @Size(min = 8, max = 250, message = "Senha deve ter entre 8 e 250 caracteres", groups = {CriarUsuario.class})
    @Column(name = "SENHAUSUA", length = 250, nullable = false)
    private String senhaUsuario;

    // Relacionamento opcional com Profissional:
    // @OneToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "ID_PROFISSIO", referencedColumnName = "IDPROFISSIO", insertable = false, updatable = false)
    // private Profissional profissional;
}
