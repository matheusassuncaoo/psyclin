package com.br.psyclin.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.EqualsAndHashCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Column;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

@Entity
@Table(name = "profissional")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Profissional {
    public interface CreateProfissional {
    }

    public interface UpdateProfissional {
    }

    public static final String TABLE_NAME = "Profissional";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cod_prof", nullable = false, length = 5)
    @NotNull(groups = CreateProfissional.class)
    @NotEmpty(groups = CreateProfissional.class)
    @Size(groups = CreateProfissional.class, min = 5, max = 5)
    private String codProf;

    @Column(name = "nome_prof", length = 100)
    @NotNull
    @NotEmpty
    @Size(min = 5, max = 100)
    private String nomeProf;

    @Column(name = "tipo_prof", length = 1)
    @NotNull
    @NotEmpty
    @Size(min = 1, max = 1)
    private Integer tipoProf; // 1: administrativo, 2: técnico básico, 3: técnico superior, 4: master

    @Column(name = "sup_prof", length = 5)
    @NotNull
    @NotEmpty
    @Size(min = 5, max = 5)
    private String supProf; // Código do supervisor (referência a outro profissional)

    @Column(name = "status_prof", length = 1)
    @NotNull
    @NotEmpty
    @Size(min = 1, max = 1)
    private Integer statusProf; // 1: ativo, 2: inativo, 3: suspenso

    @Column(name = "cons_prof", length = 10)
    @NotNull
    @NotEmpty
    @Size(max = 10)
    private String consProf; // Número do conselho profissional (ex.: CRP123456)

    @JsonProperty(access = Access.WRITE_ONLY)
    @Column(name = "senha_prof", length = 70)
    @NotNull(groups = { CreateProfissional.class, UpdateProfissional.class })
    @NotEmpty(groups = { CreateProfissional.class, UpdateProfissional.class })
    @Size(groups = { CreateProfissional.class, UpdateProfissional.class }, min = 6, max = 70)
    private String senhaProf;

    // Método auxiliar para autenticação
    public boolean authenticate(String codProf, String senhaProf) {
        return this.codProf.equals(codProf) && this.senhaProf.equals(senhaProf) && this.statusProf == 1;
    }
}