package com.printit.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;


@Entity
@Table(name = "quotation_has_material")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuotationHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @JoinColumn(name = "quotation_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private Quotation quotation_id;

    @JoinColumn(name = "material_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Material material_id;

    @Column(name = "purchaseprice")
    @Basic(optional = false) // notnull
    private BigDecimal purchaseprice;

    @Column(name = "minqty")
    @Basic(optional = true) // notnull
    private BigDecimal minqty;

    @Column(name = "maxqty")
    @Basic(optional = true) // notnull
    private BigDecimal maxqty;
}

