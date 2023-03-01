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
@Table(name = "product")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="productcode")
    @Basic(optional = false)
    private String productcode;

    @Column(name="productname")
    @Basic(optional = false)
    private String productname;

    @Column(name="productioncost")
    @Basic(optional = false)
    private BigDecimal productioncost;

    @Column(name="profitratio")
    @Basic(optional = false)
    private BigDecimal profitratio;

    @Column(name="salesprice")
    private BigDecimal salesprice;

    @Column(name="addeddate")
    @Basic(optional = false)
    private LocalDate addeddate; // this will only provide Date

    @Column(name="description")
    private String description;

    @Column(name="designedphoto")
    @Basic(optional = false)
    private byte[] designedphoto;

    @JoinColumn(name = "producttype_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Producttype producttype_id;

    @JoinColumn(name = "designtype_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Productdesigntype designtype_id;

    @JoinColumn(name = "productstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Productstatus productstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "product_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<ProductHasMaterial> productHasMaterialList;

    public Product(String productcode){
        this.productcode = productcode;
    }

    public Product (int id, String productname, BigDecimal productioncost, BigDecimal profitratio ){
        this.id = id;
        this.productname = productname;
        this.productioncost = productioncost;
        this.profitratio = profitratio;
    }

    public Product (int id, BigDecimal salesprice, String productcode, String productname, byte[] designedphoto){
        this.id = id;
        this.salesprice = salesprice;
        this.productcode = productcode;
        this.productname = productname;
        this.designedphoto = designedphoto;

    }

 }
