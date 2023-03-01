package com.printit.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Table(name = "corder_has_product")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CorderHasProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "salesprice")
    @Basic(optional = false) // notnull
    private BigDecimal salesprice;

    @Column(name = "qty")
    @Basic(optional = false) // notnull
    private Integer qty;

    @Column(name = "linetotal")
    @Basic(optional = false) // notnull
    private BigDecimal linetotal;

    @Column(name = "linediscount")
    @Basic(optional = false) // notnull
    private Integer linediscount;

    @Column(name = "requiredate")
    @Basic(optional = false) // notnull
    private LocalDate requiredate;

    @Column(name = "delivery")
    @Basic(optional = false) // notnull
    private Boolean delivery;

    @Column(name = "cpname")
    @Basic(optional = true) // notnull
    private String cpname;

    @Column(name = "cpmobile")
    @Basic(optional = true) // notnull
    private String cpmobile;

    @Column(name = "address")
    @Basic(optional = true) // notnull
    private String address;

    @Column(name = "completedqty")
    @Basic(optional = true) // notnull
    private Integer completedqty;

    @JoinColumn(name = "corder_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private Customerorder corder_id;

    @JoinColumn(name = "cities_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Cities cities_id;

    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Product product_id;

    @JoinColumn(name = "producttype_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Producttype producttype_id;

    @JoinColumn(name = "corderstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Corderstatus corderstatus_id;

}
