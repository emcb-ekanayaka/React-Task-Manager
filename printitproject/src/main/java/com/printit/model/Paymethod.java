package com.printit.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Entity
@Table(name = "paymethod")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Paymethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="name")
    @Basic(optional = true)
    private String name;
}
