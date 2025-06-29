package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Entidade que representa uma cidade no sistema.
 * Contém informações sobre cidades e seus respectivos estados.
 * 
 * <p>
 * Esta entidade está relacionada com {@link Endereco}.
 * </p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "CIDADE")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Cidade {

    /**
     * Identificador único da cidade.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDCIDADE")
    private Integer idCidade;

    /**
     * Nome da cidade.
     */
    @Column(name = "CIDADE", nullable = false, length = 100)
    private String cidade;

    /**
     * Sigla do estado (2 caracteres).
     */
    @Column(name = "ESTADO", nullable = false, length = 2)
    private String estado;

    /**
     * Lista de endereços localizados nesta cidade.
     */
    @OneToMany(mappedBy = "cidade")
    private List<Endereco> enderecos;
}