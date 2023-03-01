package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "quotation")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="qno")
    @Basic(optional = false)
    private String qno;

    @Column(name="reciveddate")
    @Basic(optional = false)
    private LocalDate reciveddate; // this will only provide Date

    @Column(name="validto")
    @Basic(optional = false)
    private LocalDate validto; // this will only provide Date

    @Column(name="validfrom")
    @Basic(optional = false)
    private LocalDate validfrom; // this will only provide Date

    @Column(name="addeddate")
    @Basic(optional = false)
    private LocalDate addeddate; // this will only provide Date

    @Column(name="description")
    @Basic(optional = true)
    private String description;


    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "quotationrequest_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Quotationrequest quotationrequest_id;

    @JoinColumn(name = "quotationstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Quotationstatus quotationstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

   @OneToMany(cascade = CascadeType.ALL , mappedBy = "quotation_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<QuotationHasMaterial> quotationHasMaterialList;

    public Quotation(String qno){
        this.qno = qno;
    }

    public Quotation (Integer id , String qno){
        this.id = id;
        this.qno = qno;
    }
 }
