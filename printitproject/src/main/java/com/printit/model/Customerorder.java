package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity // to read the class --> to know the ORM about this class and above column mapping
@Table(name = "corder")
@Data
@AllArgsConstructor //  generates a constructor with one parameter
@NoArgsConstructor // generate a constructor with no parameters
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Customerorder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="cordercode")
    @Basic(optional = false)
    private String cordercode;

    @Column(name="requiredate")
    @Basic(optional = false)
    private LocalDate requiredate;

    @Column(name="addeddate")
    @Basic(optional = false)
    private LocalDate addeddate; // this will only provide Date

    @Column(name="description")
    @Basic(optional = true)
    private String description;

    @Column(name="totalamount")
    @Basic(optional = false)
    private BigDecimal totalamount;

    @Column(name="discountrate")
    @Basic(optional = false)
    private Integer discountrate;

    @Column(name="nettotal")
    @Basic(optional = false)
    private BigDecimal nettotal;

    @Column(name="advaceamount")
    @Basic(optional = false)
    private BigDecimal advaceamount;

    @Column(name="balanceamount")
    @Basic(optional = false)
    private BigDecimal balanceamount;

    @Column(name="paidamount")
    @Basic(optional = true)
    private BigDecimal paidamount;

    @JoinColumn(name = "customertype_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Customertype customertype_id;

    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Customer customer_id;

    @JoinColumn(name = "corderstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Corderstatus corderstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

   @OneToMany(cascade = CascadeType.ALL , mappedBy = "corder_id" , fetch = FetchType.LAZY , orphanRemoval = true) //orphanRemoval --> when we need a update for innertable
    private List<CorderHasProduct> corderHasProductList;

    public Customerorder(String cordercode){
        this.cordercode = cordercode;
    }

    public Customerorder(Integer id, String cordercode, LocalDate requiredate){
        this.cordercode = cordercode;
        this.requiredate = requiredate;
        this.id = id;
    }

    public Customerorder(Integer id, String cordercode){
        this.cordercode = cordercode;
        this.id = id;
    }

 }
