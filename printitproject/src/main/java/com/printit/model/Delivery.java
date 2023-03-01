package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "delivery")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "deliverycode")
    @Basic(optional = false)
    private String deliverycode;

    @Column(name = "deliverydate")
    @Basic(optional = false)
    private LocalDate deliverydate; // this will only provide Date

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate; // this will only provide Date

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "confirmdate")
    @Basic(optional = true)
    private LocalDate confirmdate;

    @JoinColumn(name="deliverystatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Deliverystatus deliverystatus_id;

    @JoinColumn(name="driver_employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee driver_employee_id;

    @JoinColumn(name="deliveryagent_employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee deliveryagent_employee_id;

    @JoinColumn(name="added_employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee added_employee_id;

    @JoinColumn(name="confirmby_id", referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Employee confirmby_id;

    @JoinColumn(name="vehicle_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Vehicle vehicle_id;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "delivery_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<DeliveryHasCorder> deliveryHasCorderList;

    //constructor
 /*   public Delivery(Integer id, String materialname){
        this.id = id;
        this.materialname = materialname;
    }*/
    public Delivery(String deliverycode){
        this.deliverycode = deliverycode;
    }

}
