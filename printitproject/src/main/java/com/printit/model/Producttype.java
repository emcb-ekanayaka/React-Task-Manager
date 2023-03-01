package com.printit.model;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name="producttype")
@Data // To get the setters getters
@AllArgsConstructor //To create constractors
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Producttype {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "name")
    @Basic(optional = false)
    private String name;

    @Column(name = "productcost")
    @Basic(optional = true)
    private String productcost;

    @Column(name = "profitratio")
    @Basic(optional = true)
    private BigDecimal profitratio;

    @Column(name = "producttypephoto")
    @Basic(optional = true)
    private byte[] producttypephoto;

    @Column(name = "photoname")
    @Basic(optional = true)
    private String photoname;

    @JoinColumn(name="dtype_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Dtype dtype_id;

    @JoinColumn(name="maxproductqty_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Maxproductqty maxproductqty_id;

    public Producttype (Integer id , String name){
        this.id =id;
        this.name =name;
    }

    public Producttype (Integer id , byte[] producttypephoto, Dtype dtype_id, String photoname){
        this.id =id;
        this.producttypephoto = producttypephoto;
        this.dtype_id = dtype_id;
        this.photoname =photoname;
    }
}
