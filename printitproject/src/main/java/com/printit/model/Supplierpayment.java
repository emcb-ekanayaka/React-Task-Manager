package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Table(name = "supplierpayment")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Supplierpayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="billno")
    @Basic(optional = false)
    private String billno;

    @Column(name="grnamount")
    @Basic(optional = true)
    private BigDecimal grnamount;

    @Column(name="totalamount")
    @Basic(optional = false)
    private BigDecimal totalamount;

    @Column(name="paidamount")
    @Basic(optional = false)
    private BigDecimal paidamount;

    @Column(name="balanceamount")
    @Basic(optional = false)
    private BigDecimal balanceamount;

    @Column(name="paiddate")
    @Basic(optional = false)
    private LocalDate paiddate; // this will only provide Date

    @Column(name="chequeno")
    @Basic(optional = true)
    private String chequeno;

    @Column(name="chequedate")
    @Basic(optional = true)
    private LocalDate chequedate; // this will only provide Date

    @Column(name="bankaccname")
    @Basic(optional = true)
    private String bankaccname;

    @Column(name="bankaccno")
    @Basic(optional = true)
    private String bankaccno;

    @Column(name="bankname")
    @Basic(optional = true)
    private String bankname;

    @Column(name="bankbranchname")
    @Basic(optional = true)
    private String bankbranchname;

    @Column(name="transferid")
    @Basic(optional = true)
    private String transferid;

    @Column(name="transferdatetime")
    @Basic(optional = true)
    private LocalDate transferdatetime; // this will only provide Date

    @Column(name="description")
    @Basic(optional = true)
    private String description;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Grn grn_id;

    @JoinColumn(name = "paymethod_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Paymethod paymethod_id;

    @JoinColumn(name = "spaystatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Supplierpaystatus spaystatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;


   public Supplierpayment(String billno){
        this.billno = billno;
    }

/*     public Supplierpayment(Integer id , String companyname , BigDecimal creditlimit , BigDecimal arrestamount){
        this.id = id;
        this.companyname=companyname;
        this.creditlimit = creditlimit;
        this.arrestamount = arrestamount;
    }*/
 }
