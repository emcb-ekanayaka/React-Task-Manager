package com.printit.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;


@Entity
@Table(name = "productcostanalysis_has_material")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductcostanalysisHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @JoinColumn(name = "productcostanalysis_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private Productcostanalysis productcostanalysis_id;

    @JoinColumn(name = "material_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Material material_id;

    @Column(name="cost")
    @Basic(optional = false)
    private BigDecimal cost;

    @Column(name="qty")
    @Basic(optional = false)
    private BigDecimal qty;


}
