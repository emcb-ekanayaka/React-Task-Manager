package com.printit.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "productcostanalysis")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Productcostanalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="productcostanalysiscode")
    @Basic(optional = false)
    private String productcostanalysiscode;

    @Column(name="materialcost")
    @Basic(optional = false)
    private BigDecimal materialcost;

    @Column(name="productioncost")
    @Basic(optional = false)
    private BigDecimal productioncost;

    @Column(name="totalcost")
    @Basic(optional = false)
    private BigDecimal totalcost;

    @Column(name="profitratio")
    @Basic(optional = false)
    private BigDecimal profitratio;

    @Column(name="salesprice")
    @Basic(optional = false)
    private BigDecimal salesprice;

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

    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Product product_id;

    @JoinColumn(name = "pcoststatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Pcoststatus pcoststatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "productcostanalysis_id" , fetch = FetchType.LAZY , orphanRemoval = true)// eraser --> all data will received , lazy --> only received importance
    private List<ProductcostanalysisHasMaterial> productcostanalysisHasMaterialList;

    public Productcostanalysis(String productcostanalysiscode){

        this.productcostanalysiscode = productcostanalysiscode;
    }


    public Productcostanalysis(Integer id, LocalDate validto){
        this.id = id;
        this.validto= validto;
    }
 }
