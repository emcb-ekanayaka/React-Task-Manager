package com.printit.repository;

import com.printit.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerorderRepository extends JpaRepository<Customerorder, Integer> {

    @Query("select co from Customerorder co where (co.cordercode like concat('%',:searchtext,'%') or " +
            "trim(co.advaceamount) like concat('%',:searchtext,'%') or trim(co.balanceamount) like concat('%',:searchtext,'%') or " +
            "trim(co.totalamount) like concat('%',:searchtext,'%') or trim(co.addeddate) like concat('%',:searchtext,'%') or trim(co.nettotal) like concat('%',:searchtext,'%') or " +
            "co.corderstatus_id.name like concat('%',:searchtext,'%')or trim(co.discountrate) like concat('%',:searchtext,'%') or trim(co.paidamount) like concat('%',:searchtext,'%'))")
            Page<Customerorder> findAll(@Param("searchtext") String searchtext, Pageable of);


   @Query(value = "SELECT concat('CO', lpad(substring(max(co.cordercode),3)+1, '8', '0')) FROM print_it.corder as co;" , nativeQuery = true)
    String getNextNumber();

   // In Add Production Order Module Get All Customer-Ordered
    @Query("select new Customerorder (co.id ,co.cordercode,co.requiredate) from Customerorder co where co.corderstatus_id.name = 'Paid' order by co.id desc")
    List<Customerorder> list();

    // Get The CustomerOrders by Customer in customer payment module and compare with this net-total and paid total
    @Query("select co from Customerorder co where co.customer_id.id=:customerid and co.nettotal <> co.paidamount and co.corderstatus_id.name='Ordered' order by co.id desc")
    List<Customerorder> findcustomerorderbycustomer(@Param("customerid") Integer customerid);

  // Get The CustomerOrders by Customer in Deliver confirm module
  @Query("select co from Customerorder co where co.customer_id.id=:customerid and co.corderstatus_id.name='Completed' order by co.id desc")
  List<Customerorder> findcustomerorderbycustomertodeliverconfirm(@Param("customerid") Integer customerid);

    //when we  select the customer order , the require date of the customer order will be in production order require date field.
    @Query("select co from Customerorder co where co.cordercode=:cordercode")
    Customerorder findBycustomerorder(@Param("cordercode") String cordercode);

  /*   //query for get supplier with id , companyname , creditlimit , arrestamount
    @Query("select new Supplier(s.id , s.companyname, s.creditlimit, s.arrestamount) from Supplier s where s.supplierstatus_id.name='Active'")
    List<Supplier> list();*/

    @Query("select count(co.id) from Customerorder co where co.customer_id.id=:customerid group by co.customer_id.id")
    Integer getCountByCustomer(@Param("customerid") Integer customerid);

    // this is for in window view
    @Query("select co from Customerorder co where co.customer_id.id=:customerid order by co.id desc")
    List<Customerorder> findcustomerorderbycustomertowindow(@Param("customerid") Integer customerid);

    // completed orders and delivery requires order filter
    @Query(value = "SELECT co FROM Customerorder co where co.corderstatus_id.id=4 and co.id in (select cohp.corder_id.id from CorderHasProduct cohp where cohp.delivery=true )")
    List<Customerorder> listofcustomerorderfordelivery();

    // orders by selecting delivery
    @Query(value = "SELECT co FROM Customerorder co where co.id in (select dhco.corder_id.id from DeliveryHasCorder dhco where dhco.deliverystatus_id.name='4')")
    List<Customerorder> listofcustomerorderbydeliver();

    // orders by selecting delivery
    @Query(value = "SELECT co FROM Customerorder co where co.id in (select dhco.corder_id.id from DeliveryHasCorder dhco where dhco.delivery_id.id=:deliverid)")
    List<Customerorder> customerorderbydeliver(@Param("deliverid") Integer deliverid);

    /*// get customers by selecting statsus combo box
    @Query(value = "SELECT co FROM Customerorder co where co.corderstatus_id.id=:customerstatusid")
    List<Customerorder> byselectedcustomerstatus(@Param("customerstatusid") Integer customerstatusid);*/

}
