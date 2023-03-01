package com.printit.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "materialinventory")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Materialinventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "avaqty")
    @Basic(optional = true)
    private BigDecimal avaqty;

    @Column(name = "totalqty")
    @Basic(optional = true)
    private BigDecimal totalqty;


    @JoinColumn(name="inventorystatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Inventorystatus inventorystatus_id;

    @JoinColumn(name="material_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Material material_id;


}
