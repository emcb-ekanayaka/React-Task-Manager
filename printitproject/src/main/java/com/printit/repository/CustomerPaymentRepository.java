package com.printit.repository;

import com.printit.model.CustomerPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

//JPArepo interface has many function, that's why we and import and use it as extends
public interface CustomerPaymentRepository extends JpaRepository <CustomerPayment, Integer>{

    @Query("select c from CustomerPayment c where(c.corder_id.cordercode like concat('%',:searchtext,'%') or " +
            "c.employee_id.callingname like concat('%',:searchtext,'%') or concat(c.paidamount,'') like concat('%',:searchtext,'%') or " +
            "concat(c.totalamount,'') like concat('%',:searchtext,'%') or concat(c.balanceamount, '') like concat('%',:searchtext,'%') or " +
            "concat(c.bilno,'') like concat('%',:searchtext,'%') or c.customer_id.regno like concat('%',:searchtext,'%') or concat(c.orderamount,'') like concat('%',:searchtext,'%') or " +
            "c.paymenttype_id.name like concat('%',:searchtext,'%') or c.paymethod_id.name like concat('%',:searchtext,'%'))")
    Page<CustomerPayment> findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query(value = "SELECT concat('CP',lpad(substring(max(c.bilno), 3)+1 , '8','0')) FROM print_it.cpayment as c;" , nativeQuery = true)
    String getNextNumber();

    @Query("SELECT cp FROM CustomerPayment cp where cp.corder_id.id=:customerorderid")
    List<CustomerPayment> listbyCustomerpayment(@Param("customerorderid") Integer customerorderid);

    //for window view
    @Query("SELECT new CustomerPayment (cp.id, cp.paiddatetime) from CustomerPayment cp where cp.corder_id.id=:customerorderid")
    CustomerPayment customerpaymentdetails(@Param("customerorderid") Integer customerorderid);


}
