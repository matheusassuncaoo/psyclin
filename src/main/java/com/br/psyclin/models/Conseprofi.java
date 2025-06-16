package com.br.psyclin.models;

// Jakarta Persistence
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Jakarta Validation
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Lombok
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "CONSEPROFI")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Conseprofi {

    public interface CriarConseprofi {}
    public interface AtualizarConseprofi {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "IDCONSEPROFI")
    private Long idConseprofi;

    @NotBlank(message = "Descrição não pode ser vazia", groups = {CriarConseprofi.class, AtualizarConseprofi.class})
    @Size(max = 100, message = "Descrição deve ter no máximo 100 caracteres", groups = {CriarConseprofi.class, AtualizarConseprofi.class})
    @Column(name = "DESCRICAO", length = 100, nullable = false, unique = true)
    private String descricao;

    @NotBlank(message = "Abreviatura não pode ser vazia", groups = {CriarConseprofi.class, AtualizarConseprofi.class})
    @Size(max = 10, message = "Abreviatura deve ter no máximo 10 caracteres", groups = {CriarConseprofi.class, AtualizarConseprofi.class})
    @Column(name = "ABREVCONS", length = 10, nullable = false, unique = true)
    private String abreviatura;
}
