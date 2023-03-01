package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "material")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "materialcode")
    @Basic(optional = false)
    private String materialcode;

    @Column(name = "nopieces")
    @Basic(optional = false)
    private Integer nopieces;

    @Column(name = "materialname")
    @Basic(optional = false)
    private String materialname;

    @Column(name = "rop")
    @Basic(optional = true)
    private Integer rop;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate; // this will only provide Date

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "purchaseprice")
    @Basic(optional = true)
    private BigDecimal purchaseprice;

    @JoinColumn(name="size_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Size size_id;

    @JoinColumn(name="color_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Color color_id;

    @JoinColumn(name="materialcategory_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Materialcategory materialcategory_id;

    @JoinColumn(name="unit_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Unit unit_id;

    @JoinColumn(name="materialstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Materialstatus materialstatus_id;

    @JoinColumn(name="employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id ;


    //constructor
    public Material(Integer id, String materialname){
        this.id = id;
        this.materialname = materialname;
    }
    public Material(String materialcode){
        this.materialcode = materialcode;
    }

}
