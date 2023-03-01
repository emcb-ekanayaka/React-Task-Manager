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
@Table(name = "porder")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Purchaseorder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="pordercode")
    @Basic(optional = false)
    private String pordercode;

    @Column(name="requiredate")
    @Basic(optional = false)
    private LocalDate requiredate;

    @Column(name="totalamount")
    @Basic(optional = false)
    private BigDecimal totalamount;

    @Column(name="addeddate")
    @Basic(optional = false)
    private LocalDate addeddate; // this will only provide Date

    @Column(name="description")
    @Basic(optional = true)
    private String description;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "quotation_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Quotation quotation_id;

    @JoinColumn(name = "porderstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Porderstatus porderstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "porder_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<PorderHasMaterial> porderHasMaterialList;

    public Purchaseorder(String pordercode){
        this.pordercode = pordercode;
    }

    public Purchaseorder(Integer id , String pordercode){
        this.id = id;
        this.pordercode = pordercode;
    }
 }
