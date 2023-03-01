package com.printit.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;


@Entity
@Table(name = "paymenttype")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Paymenttype {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="name")
    @Basic(optional = true)
    private String name;

    @Column(name="ratio")
    @Basic(optional = true)
    private BigDecimal ratio;
}
