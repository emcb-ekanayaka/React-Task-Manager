package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "supplier")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="suppliercode")
    @Basic(optional = false)
    private String suppliercode;

    @Column(name="companyname")
    @Basic(optional = false)
    private String companyname;

    @Column(name="address")
    @Basic(optional = false)
    private String address;

    @Column(name="email")
    @Basic(optional = false)
    private String email;

    @Column(name="landno")
    @Basic(optional = false)
    private String landno;

    @Column(name="cpname")
    @Basic(optional = false)
    private String cpname;

    @Column(name="cpmobile")
    @Basic(optional = false)
    private String cpmobile;

    @Column(name="arrestamount")
    @Basic(optional = true)
    private BigDecimal arrestamount;

    @Column(name="creditlimit")
    @Basic(optional = true)
    private BigDecimal creditlimit;

    @Column(name="bankname")
    @Basic(optional = true)
    private String bankname;

    @Column(name="bankbranchname")
    @Basic(optional = true)
    private String bankbranchname;

    @Column(name="bankacco")
    @Basic(optional = true)
    private String bankacco;

    @Column(name="bankaccname")
    @Basic(optional = true)
    private String bankaccname;

    @Column(name="addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name="description")
    @Basic(optional = true)
    private String description;

    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Supplierstatus supplierstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "supplier_id" , fetch = FetchType.LAZY , orphanRemoval = true) //orphanRemoval --> when we need a update for innertable
    private List<SupplierHasMaterial> supplierHasMaterials;

    public Supplier(String suppliercode){
        this.suppliercode = suppliercode;
    }

    public Supplier(Integer id , String companyname , BigDecimal creditlimit , BigDecimal arrestamount){
        this.id = id;
        this.companyname=companyname;
        this.creditlimit = creditlimit;
        this.arrestamount = arrestamount;
    }

    public Supplier(String companyname , BigDecimal arrestamount){
        this.companyname=companyname;
        this.arrestamount = arrestamount;
    }
 }
