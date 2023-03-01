package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "customerrequest")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Customerrequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="fullname")
    @Basic(optional = false)
    private String fullname;

    @Column(name="email")
    @Basic(optional = false)
    private String email;

    @Column(name="contactnumber")
    @Basic(optional = false)
    private String contactnumber;

    @Column(name="requiredate")
    @Basic(optional = false)
    private LocalDate requiredate; // this will only provide Date

    @Column(name="addeddate")
    @Basic(optional = false)
    private LocalDate addeddate; // this will only provide Date

    @JoinColumn(name = "cusrequeststatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Customerrequeststatus cusrequeststatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "customerrequest_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<CustomerrequestHasProduct> customerrequestHasProductList;


 }
