package com.printit.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "color")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Color {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "name")
    @Basic(optional = true)
    private String name;

    @JoinColumn(name = "materialcategory_id", referencedColumnName = "id") //mapping to name of the col
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Materialcategory materialcategory_id;

}
