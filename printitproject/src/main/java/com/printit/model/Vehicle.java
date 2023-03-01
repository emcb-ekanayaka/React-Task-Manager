package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "vehicle")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "vehiclenumber")
    @Basic(optional = true)
    private String vehiclenumber;

    @Column(name = "vehiclename")
    @Basic(optional = true)
    private String vehiclename;

    @JoinColumn(name="vtype_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Vehicletype vtype_id;

    @JoinColumn(name="vstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER) //EAGER will provide the object of the Vehicle status
    private Vehiclestatus vstatus_id;

    public Vehicle (Integer id, String vehiclename){
        this.id = id;
        this.vehiclename = vehiclename;
    }

    public Vehicle (Integer id, String vehiclename, String vehiclenumber){
        this.id = id;
        this.vehiclename = vehiclename;
        this.vehiclenumber = vehiclenumber;
    }
}
