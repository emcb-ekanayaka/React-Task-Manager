package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cpayment")
@Data // To get the setters getters
@AllArgsConstructor //To create constractors
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomerPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id ;

    @Column(name = "bilno")
    @Basic(optional = false)
    private String bilno ;

    @Column(name = "orderamount")
    @Basic(optional = false)
    private BigDecimal orderamount ;

    @Column(name = "totalamount")
    @Basic(optional = false)
    private BigDecimal totalamount ;

    @Column(name = "paidamount")
    @Basic(optional = false)
    private BigDecimal paidamount ;

    @Column(name = "balanceamount")
    @Basic(optional = false)
    private BigDecimal balanceamount ;

    @Column(name = "customerbalaceamount")
    @Basic(optional = false)
    private BigDecimal customerbalaceamount ;

    @Column(name = "paiddatetime")
    @Basic(optional = false)
    private LocalDateTime paiddatetime ; // this will provide Date & Time

    @Column(name = "chequeno")
    @Basic(optional = true)
    private String chequeno;

    @Column(name = "chequedate")
    @Basic(optional = true)
    private LocalDate chequedate;

    @Column(name = "bankacountname")
    @Basic(optional = true)
    private String bankacountname;

    @Column(name = "bankaccno")
    @Basic(optional = true)
    private String bankaccno;

    @Column(name = "bankname")
    @Basic(optional = true)
    private String bankname;

    @Column(name = "bankbranchname")
    @Basic(optional = true)
    private String bankbranchname;

    @Column(name = "transferid")
    @Basic(optional = true)
    private String transferid;

    @Column(name = "transferdatetime")
    @Basic(optional = true)
    private LocalDate transferdatetime;

    @JoinColumn(name="customer_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Customer customer_id ;

    @JoinColumn(name="corder_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Customerorder corder_id ;

    @JoinColumn(name="paymenttype_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Paymenttype paymenttype_id ;

    @JoinColumn(name="paymethod_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Paymethod paymethod_id ;

    @JoinColumn(name="employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id ;

    @JoinColumn(name="cpaystatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Custmerpaystatus cpaystatus_id ;

   public CustomerPayment(String bilno){
        this.bilno = bilno;
    }


    public CustomerPayment(Integer id,  LocalDateTime paiddatetime ){
        this.id = id;
        this.paiddatetime = paiddatetime;
    }
}
