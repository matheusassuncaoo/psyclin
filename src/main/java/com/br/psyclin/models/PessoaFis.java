package com.br.psyclin.models;

// Jakarta Persistence
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Jakarta Validation
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// Lombok
import lombok.Data;
import lombok.EqualsAndHashCode;

// Java Time
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "PESSOAFIS")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PessoaFis {

    public interface CriarPessoaFis {}
    public interface AtualizarPessoaFis {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "IDPESSOAFIS")
    private Long idPessoaFis;

    @NotNull(message = "Pessoa é obrigatória", groups = {CriarPessoaFis.class, AtualizarPessoaFis.class})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PESSOA", referencedColumnName = "IDPESSOA")
    private Pessoa pessoa;

    @NotBlank(message = "CPF não pode ser vazio", groups = {CriarPessoaFis.class, AtualizarPessoaFis.class})
    @Size(min = 11, max = 11, message = "CPF deve ter 11 caracteres", groups = {CriarPessoaFis.class, AtualizarPessoaFis.class})
    @Column(name = "CPFPESSOA", length = 11, nullable = false, unique = true)
    private String cpfPessoa;

    @NotBlank(message = "Nome não pode ser vazio", groups = {CriarPessoaFis.class, AtualizarPessoaFis.class})
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres", groups = {CriarPessoaFis.class, AtualizarPessoaFis.class})
    @Column(name = "NOMEPESSOA", length = 100, nullable = false)
    private String nomePessoa;

    @NotNull(message = "Data de nascimento é obrigatória", groups = {CriarPessoaFis.class, AtualizarPessoaFis.class})
    @Column(name = "DATANASCPES", nullable = false)
    private LocalDate dataNascimento;

    @NotNull(message = "Sexo é obrigatório", groups = {CriarPessoaFis.class, AtualizarPessoaFis.class})
    @Column(name = "SEXOPESSOA", nullable = false)
    private String sexoPessoa;

    @Column(name = "DATACRIACAO", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;
}
