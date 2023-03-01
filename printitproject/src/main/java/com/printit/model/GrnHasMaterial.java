package com.printit.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "grn_has_material")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GrnHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private Grn grn_id;

    @JoinColumn(name = "material_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Material material_id;

    @Column(name="purchaseprice")
    @Basic(optional = true)
    private BigDecimal purchaseprice;

    @Column(name="qty")
    @Basic(optional = false)
    private BigDecimal qty;

    @Column(name="linetotal")
    @Basic(optional = true)
    private BigDecimal linetotal;

}
