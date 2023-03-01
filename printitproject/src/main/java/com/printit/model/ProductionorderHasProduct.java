package com.printit.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;


@Entity
@Table(name = "productionorder_has_product")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductionorderHasProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @JoinColumn(name = "productionorder_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private Productionorder productionorder_id;

    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Product product_id;

    @Column(name="qty")
    @Basic(optional = false)
    private Integer qty;

    @Column(name="requiredate")
    @Basic(optional = false)
    private LocalDate requiredate;

    @Column(name="completedqty")
    @Basic(optional = false)
    private Integer completedqty;

    @JoinColumn(name = "productionstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Productionstatus productionstatus_id;
}
