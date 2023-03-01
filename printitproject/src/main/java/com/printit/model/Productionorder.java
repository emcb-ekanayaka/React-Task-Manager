package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "productionorder")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Productionorder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="productionordercode")
    @Basic(optional = false)
    private String productionordercode;

    @Column(name="requiredate")
    @Basic(optional = false)
    private LocalDate requiredate; // this will only provide Date

    @Column(name="addeddate")
    @Basic(optional = false)
    private LocalDate addeddate; // this will only provide Date

    @Column(name="description")
    @Basic(optional = true)
    private String description;

    @Column(name="confirmdate")
    @Basic(optional = true)
    private LocalDate confirmdate; // this will only provide Date

    @JoinColumn(name = "corder_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Customerorder corder_id;

    @JoinColumn(name = "productionstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Productionstatus productionstatus_id;

    @JoinColumn(name = "confirm_employee_id", referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Employee confirm_employee_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "productionorder_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<ProductionorderHasProduct> productionorderHasProductList;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "productionorder_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<ProductionorderHasMaterial> productionorderHasMaterialList;

    public Productionorder(String productionordercode){
        this.productionordercode = productionordercode;
    }

    public Productionorder(Integer id, LocalDate addeddate ){
        this.id = id;
        this.addeddate = addeddate;
    }

 }
