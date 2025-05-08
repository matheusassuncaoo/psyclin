package com.br.psyclin.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Column;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

@Entity
@Table(name = "profissional")
@Getter
@Setter

public class Profissional {
    public interface CreateUser {
    }

    public interface UpdateUser {
    }

    public static final String TABLE_NAME = "Profissional";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cod_prof", nullable = false, length = 5)
    @NotNull(groups = CreateUser.class)
    @NotEmpty(groups = CreateUser.class)
    @Size(groups = CreateUser.class, min = 5, max = 5)
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
    @Size(min = 5, max = 10)
    private String consProf; // Número do conselho profissional (ex.: CRP123456)

    @JsonProperty(access = Access.WRITE_ONLY)
    @Column(name = "senha_prof", length = 10)
    @NotNull(groups = { CreateUser.class, UpdateUser.class })
    @NotEmpty(groups = { CreateUser.class, UpdateUser.class })
    @Size(groups = { CreateUser.class, UpdateUser.class }, min = 6, max = 10)
    private String senhaProf;

    // private List<Task> = new ArrayList<>(); // Lista de tarefas associadas ao
    // profissional

    @Override
    public boolean equals(Object obj) {
        if (obj == this)
            return true;
        if (obj == null)
            return false;
        if (!(obj instanceof Profissional))
            return false;
        Profissional other = (Profissional) obj;
        if (this.id == null) {
            if (other.id != null)
                return false;
        } else if (!this.id.equals(other.id))
            return false;
        return java.util.Objects.equals(this.id, other.id) && java.util.Objects.equals(this.codProf, other.codProf)
                && java.util.Objects.equals(this.nomeProf, other.nomeProf)
                && java.util.Objects.equals(this.tipoProf, other.tipoProf)
                && java.util.Objects.equals(this.supProf, other.supProf)
                && java.util.Objects.equals(this.statusProf, other.statusProf)
                && java.util.Objects.equals(this.consProf, other.consProf)
                && java.util.Objects.equals(this.senhaProf, other.senhaProf);
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

}