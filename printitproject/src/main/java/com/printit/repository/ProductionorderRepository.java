package com.printit.repository;


import com.printit.model.Productionorder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ProductionorderRepository extends JpaRepository<Productionorder, Integer> {

    @Query("select po from Productionorder po where (po.productionordercode like concat('%',:searchtext,'%') or " +
            "trim(po.addeddate) like concat('%',:searchtext,'%') or po.description like concat('%',:searchtext,'%') or " +
            "po.employee_id.callingname like concat('%',:searchtext,'%') or trim(po.requiredate) like concat('%',:searchtext,'%') or trim(po.confirmdate) like concat('%',:searchtext,'%') or " +
            "po.productionstatus_id.name like concat('%',:searchtext,'%')or po.corder_id.cordercode like concat('%',:searchtext,'%') )")
            Page<Productionorder> findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query(value = "SELECT concat('PO',lpad(substring(max(po.productionordercode),3)+1,'8','0')) FROM print_it.productionorder as po;" ,nativeQuery = true)
    String getNextNumber();

    //get production object to  confirm a production [Production Confirm]
    @Query("select prdo from Productionorder prdo where prdo.productionstatus_id.name='Pending'")
    List<Productionorder> list();

    //get production object from production by --> on-going status and confirm status
    @Query("select prdo from Productionorder prdo where prdo.productionstatus_id.name='On-Going' or prdo.productionstatus_id.name='Confirmed'")
    List<Productionorder> listbystatus();

    // when some customer cancel the order
    @Query("select prdo from Productionorder prdo where prdo.corder_id.id=:customerorderid")
    Productionorder getByCustomerOrder(@Param("customerorderid") Integer customerorderid);


    // view window order details
/*    @Query(value = "SELECT p.id , p.addeddate\n" +
            "FROM print_it.productionorder as p\n" +
            "join corder on corder.id = p.corder_id where corder.id=:customerorderid;", nativeQuery = true)
    Productionorder getProductionDetails(@Param("customerorderid") Integer customerorderid);*/

}
