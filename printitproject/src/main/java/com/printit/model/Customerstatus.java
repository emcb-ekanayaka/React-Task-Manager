package com.printit.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name="customerstatus")
@Data // To get the setters getters
@AllArgsConstructor //To create constractors
@NoArgsConstructor
public class Customerstatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id ;

    @Column(name = "name")
    @Basic(optional = false)
    private String name;


}
