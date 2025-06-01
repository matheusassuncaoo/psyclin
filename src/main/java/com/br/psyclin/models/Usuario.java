package com.br.psyclin.models;

import com.fasterxml.jackson.annotation.JsonProperty;

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

@Entity
@Table(name = "USUARIO")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDUSUARIO")
    @EqualsAndHashCode.Include
    private Integer idUsuario;

    // Relacionamento com Profissional (um para um, chave estrangeira aqui)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PROFISSIO", referencedColumnName = "IDPROFISSIO", nullable = false, unique = true)
    @NotNull(message = "Referência ao Profissional não pode ser nula")
    private Profissional profissional;

    @NotBlank(message = "Login do usuário não pode ser vazio")
    @Size(max = 100, message = "Login deve ter no máximo 100 caracteres")
    @Column(name = "LOGUSUARIO", length = 100, nullable = false, unique = true)
    private String loginUsuario;

    @NotBlank(message = "Senha não pode ser vazia")
    @Size(max = 250, message = "Hash da senha deve ter no máximo 250 caracteres") // Tamanho para hash BCrypt
    @Column(name = "SENHAUSUA", length = 250, nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // Não expor senha em respostas JSON
    private String senhaUsuario; // Armazenará o hash da senha

    // Relacionamento inverso com PermiUsua (se necessário)
    // @OneToMany(mappedBy = "usuario")
    // private List<PermiUsua> permissoes;

    // Relacionamento inverso com SoliOdonto (se necessário)
    // @OneToMany(mappedBy = "usuario")
    // private List<SoliOdonto> solicitacoesOdonto;

    // Relacionamento inverso com SetorUsua (se necessário)
    // @OneToMany(mappedBy = "usuario")
    // private List<SetorUsua> setoresUsuario;

}
