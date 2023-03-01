package com.printit.repository;

import com.printit.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

//JPArepo interface has many function, that's why we and import and use it as extends
public interface CustomerRepository extends JpaRepository <Customer, Integer>{

    @Query("select i from Customer i where(i.cfax like concat('%',:searchtext,'%') or " +
            "i.cemail like concat('%',:searchtext,'%') or i.cland like concat('%',:searchtext,'%') or " +
            "i.customerstatus_id.name like concat('%',:searchtext,'%') or i.customertype_id.name like concat('%',:searchtext,'%') or " +
            "i.companyname like concat('%',:searchtext,'%') or i.nic like concat('%',:searchtext,'%') or i.cpmobile like concat('%',:searchtext,'%') or " +
            "i.fname like concat('%',:searchtext,'%') or i.lname like concat('%',:searchtext,'%') or " +
            "i.mobile like concat('%',:searchtext,'%') or i.regno like concat('%',:searchtext,'%'))")
    Page<Customer> findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query(value = "SELECT concat('C',lpad(substring(max(c.regno), 2)+1 , '9','0')) FROM print_it.customer as c;" , nativeQuery = true)
    String getNextNumber();

    @Query("select new Customer(c.id , c.regno,c.companyname , c.fname, c.lname, c.nic) from Customer c order by c.id desc")
    List<Customer> list();

    //to check the customer duplication ---> phone number
    @Query("SELECT c FROM Customer c where c.mobile=:cmobile")
    Customer listofcustomernumbers(@Param("cmobile") String cmobile);

    //to check the customer duplication ---> Nic number
    @Query("SELECT c FROM Customer c where c.nic=:cnic")
    Customer listofcustomernic(@Param("cnic") String cnic);

    //to check the customer duplication ---> Individual Email number
    @Query("SELECT c FROM Customer c where c.email=:cusemail")
    Customer excustomeremail(@Param("cusemail") String cusemail);

    //to check the customer duplication ---> Whole Email Address
    @Query("SELECT c FROM Customer c where c.cemail=:cemail")
    Customer exwholecustomeremail(@Param("cemail") String cemail);

    //to check the customer duplication ---> Duplication land Address
    @Query("SELECT c FROM Customer c where c.land=:cusland")
    Customer exlandnumber(@Param("cusland") String cusland);

    //to check the customer duplication ---> Duplication fax Address
    @Query("SELECT c FROM Customer c where c.cfax=:cusfax")
    Customer exfaxNumber(@Param("cusfax") String cusfax);

    //to check the customer duplication ---> Duplication fax Address
    @Query("SELECT c FROM Customer c where c.cpmobile=:cpmobile")
    Customer excusmobile(@Param("cpmobile") String cpmobile);

    @Query("SELECT c FROM Customer c where c.customertype_id.id=:customertypeid order by c.id desc")
    List<Customer> listbyCustomertype(@Param("customertypeid") Integer customertypeid);


}
