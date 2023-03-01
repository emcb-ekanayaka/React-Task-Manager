package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "quotationrequest")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Quotationrequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="qrno")
    @Basic(optional = false)
    private String qrno;

    @Column(name="requireddate")
    @Basic(optional = false)
    private LocalDate requireddate; // this will only provide Date

    @Column(name="addeddate")
    @Basic(optional = false)
    private LocalDate addeddate; // this will only provide Date

    @Column(name="description")
    @Basic(optional = true)
    private String description;


    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "qrstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Qrstatus qrstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

   @OneToMany(cascade = CascadeType.ALL , mappedBy = "quotationrequest_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<QuotationRequestHasMaterial> quotationRequestHasMaterialList;

    public Quotationrequest(String qrno){
        this.qrno = qrno;
    }

    public Quotationrequest(Integer id, String qrno){
        this.id = id;
        this.qrno = qrno;
    }

 }
