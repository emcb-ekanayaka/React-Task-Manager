package com.printit.repository;

import com.printit.model.Delivery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;

//JPArepo interface has many function, that's why we and import and use it as extends
public interface DeliveryRepository extends JpaRepository <Delivery, Integer> {

    @Query("select d from Delivery d where(d.deliverycode like concat('%',:searchtext,'%') or " +
            "concat(d.deliverydate,'') like concat('%',:searchtext,'%') or concat(d.addeddate,'') like concat('%',:searchtext,'%') or " +
            "d.description like concat('%',:searchtext,'%') or concat(d.added_employee_id.callingname,'') like concat('%',:searchtext,'%') or " +
            "concat(d.deliveryagent_employee_id.callingname,'') like concat('%',:searchtext,'%') or concat(d.deliverystatus_id.name,'')" +
            "like concat('%',:searchtext,'%') or d.added_employee_id.callingname like concat('%',:searchtext,'%') or " +
            "concat(d.driver_employee_id.callingname,'') like concat('%',:searchtext,'%') or concat(d.vehicle_id.vehiclename,'')" +
            "like concat('%',:searchtext,'%') )")
    Page<Delivery> findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query(value = "SELECT concat('D', lpad(substring(max(d.deliverycode),2)+1,'9','0')) FROM print_it.delivery as d;" , nativeQuery = true)
    String getNextNumber();

   //Query in Repository
  /* SELECT d.deliverydate, d.deliveryagent_employee_id, d.driver_employee_id, d.vehicle_id
    FROM print_it.delivery as d where not d.deliverydate = '2022-01-30';*/
    @Query("select d from Delivery d where not d.deliverydate=:deliverydateid")
    Delivery deliveryagentvehical(@RequestParam("deliverydateid") Date deliverydateid);

}
