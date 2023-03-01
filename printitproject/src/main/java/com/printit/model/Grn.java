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
@Table(name = "grn")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Grn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="grncode")
    @Basic(optional = false)
    private String grncode;

    @Column(name="supplierbillno")
    @Basic(optional = false)
    private String supplierbillno;

    @Column(name="recieveddate")
    @Basic(optional = false)
    private LocalDate recieveddate; // this will only provide Date

    @Column(name="grandtotal")
    @Basic(optional = false)
    private BigDecimal grandtotal;

    @Column(name="discountratio")
    @Basic(optional = false)
    private BigDecimal discountratio;

    @Column(name="nettotal")
    @Basic(optional = false)
    private BigDecimal nettotal;

    @Column(name="description")
    @Basic(optional = true)
    private String description;

    @Column(name="addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name="paidamount")
    @Basic(optional = true)
    private BigDecimal paidamount;

    @JoinColumn(name = "porder_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Purchaseorder porder_id;

    @JoinColumn(name = "grnstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Grnstatus grnstatus_id;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "grn_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<GrnHasMaterial> grnHasMaterialList;

    public Grn(String nextNumber) {
        this.grncode = nextNumber;
    }
    public Grn(Integer id , String grncode,BigDecimal nettotal, BigDecimal grandtotal) {
        this.id = id;
        this.grncode = grncode;
        this.nettotal = nettotal;
        this.grandtotal = grandtotal;
    }


}
