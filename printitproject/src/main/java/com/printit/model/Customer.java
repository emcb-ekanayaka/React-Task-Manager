package com.printit.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "customer")
@Data // To get the setters getters
@AllArgsConstructor //will generate the constructor with one or more params
@NoArgsConstructor // will generate the constructor with no params
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Customer{

    @Id // specified the primary key of entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // generate strategies over the values of primary key ---> feild eka aduraganna
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id ;

    @Column(name = "regno")
    @Basic(optional = false)
    private String regno ;

    @Column(name = "companyname")
    @Basic(optional = true)
    private String companyname ;

    @Column(name = "fname")
    @Basic(optional = true)
    private String fname ;

    @Column(name = "lname")
    @Basic(optional = true)
    private String lname ;

    @Column(name = "mobile")
    @Basic(optional = true)
    private String mobile ;

    @Column(name = "nic")
    @Basic(optional = true)
    private String nic ;

    @Column(name = "email")
    @Basic(optional = true)
    private String email ;

    @Column(name = "land")
    @Basic(optional = true)
    private String land ;

    @Column(name = "address")
    @Basic(optional = false)
    private String address ;

    @Column(name = "description")
    @Basic(optional = true)
    private String description ;

    @Column(name = "cemail")
    @Basic(optional = true)
    private String cemail ;

    @Column(name = "cland")
    @Basic(optional = true)
    private String cland ;

    @Column(name = "cfax")
    @Basic(optional = true)
    private String cfax ;

    @Column(name = "cpmobile")
    @Basic(optional = true)
    private String cpmobile ;

    @Column(name = "cpname")
    @Basic(optional = true)
    private String cpname ;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate; // this will only provide Date

    @JoinColumn(name="customerstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Customerstatus customerstatus_id ;

    @JoinColumn(name="cities_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Cities cities_id ;

    @JoinColumn(name="customertype_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Customertype customertype_id ;

    @JoinColumn(name="employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER) //
    private Employee employee_id ;

    public Customer(String regno){
        this.regno = regno;
    }

    public Customer(Integer id,String regno, String companyname , String fname, String lname, String nic){
        this.id = id;
        this.regno = regno;
        this.companyname = companyname;
        this.fname = fname;
        this.lname = lname;
        this.nic = nic;
    }
}
