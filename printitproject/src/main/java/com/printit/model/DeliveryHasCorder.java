package com.printit.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "delivery_has_corder")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryHasCorder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @JoinColumn(name = "delivery_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private Delivery delivery_id;

    @JoinColumn(name = "corder_id", referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Customerorder corder_id;

    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Product product_id;

    @JoinColumn(name = "deliverystatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Deliverystatus deliverystatus_id;

    @Column(name="cpname")
    @Basic(optional = true)
    private String cpname;

    @Column(name="cpmobile")
    @Basic(optional = false)
    private String cpmobile;

    @Column(name="address")
    @Basic(optional = true)
    private String address;

    @Column(name="qty")
    @Basic(optional = true)
    private Integer qty;

}
