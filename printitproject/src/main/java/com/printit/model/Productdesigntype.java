package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "designtype")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Productdesigntype {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "designcode")
    @Basic(optional = false)
    private String designcode ;

    @Column(name = "designname")
    @Basic(optional = false)
    private String designname ;

    @Column(name = "photo")
    @Basic(optional = false)
    private byte[] photo ;

    @Column(name = "imagename")
    @Basic(optional = false)
    private String imagename ;

    @Column(name = "designcost")
    private BigDecimal designcost ;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @JoinColumn(name="customtype_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Customtype customtype_id ;

    @JoinColumn(name="dtype_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Dtype dtype_id ;

    @JoinColumn(name="producttype_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Producttype producttype_id;

    @JoinColumn(name="dcategory_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Dcategory dcategory_id ;

    @JoinColumn(name="designer_id", referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Employee designer_id ;

    @JoinColumn(name="dstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Dstatus dstatus_id ;

    @JoinColumn(name="employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id ;

    public Productdesigntype(String designcode) {
        this.designcode = designcode;
    }

    public Productdesigntype( Integer id, String designcode) {
        this.designcode = designcode;
        this.id = id;
    }
}
