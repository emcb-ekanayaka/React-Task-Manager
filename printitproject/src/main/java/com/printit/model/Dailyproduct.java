package com.printit.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "dailyproduct")


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Dailyproduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @Column(name="orderqty")
    @Basic(optional = false)
    private Integer orderqty;

    @Column(name="currentcomqty")
    @Basic(optional = false)
    private Integer currentcomqty;

    @Column(name="dailyqty")
    @Basic(optional = false)
    private Integer dailyqty;

    @Column(name="totalcomqty")
    @Basic(optional = false)
    private Integer totalcomqty;

    @Column(name="balanceqty")
    @Basic(optional = false)
    private Integer balanceqty;

    @Column(name="addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @JoinColumn(name = "productionorder_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Productionorder productionorder_id;

    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Product product_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    public Dailyproduct (int id, int totalcomqty , int orderqty , int currentcomqty , int dailyqty, int balanceqty, LocalDate addeddate )
    {
        this.id = id;
        this.totalcomqty = totalcomqty;
        this.currentcomqty = currentcomqty;
        this.orderqty = orderqty;
        this.dailyqty = dailyqty;
        this.balanceqty = balanceqty;
        this.addeddate = addeddate;
    }

    public Dailyproduct (int id, int dailyqty, Product product_id )
    {
        this.id = id;
        this.dailyqty = dailyqty;
        this.product_id = product_id;

    }

 }
