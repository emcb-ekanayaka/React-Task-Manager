package com.printit.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Entity
@Table(name = "customerrequest_has_product")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerrequestHasProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @JoinColumn(name = "customerrequest_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private Customerrequest customerrequest_id;

    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Product product_id;

    @JoinColumn(name = "designtype_id", referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Productdesigntype designtype_id;

    @JoinColumn(name = "producttype_id", referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Producttype producttype_id;

    @Column(name="qty")
    @Basic(optional = false)
    private Integer qty;

    @Column(name="custermizeddesign")
    @Basic(optional = false)
    private Boolean custermizeddesign;

}
