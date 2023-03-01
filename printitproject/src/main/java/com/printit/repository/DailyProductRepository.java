package com.printit.repository;

import com.printit.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DailyProductRepository extends JpaRepository<Dailyproduct, Integer> {

    @Query("select dp from Dailyproduct dp where (dp.employee_id.callingname like concat('%',:searchtext,'%') or " +
            "trim(dp.addeddate) like concat('%',:searchtext,'%') or dp.product_id.productname like concat('%',:searchtext,'%') or " +
            "trim(dp.balanceqty) like concat('%',:searchtext,'%') or trim(dp.currentcomqty) like concat('%',:searchtext,'%') or trim(dp.dailyqty) like concat('%',:searchtext,'%') or " +
            "trim(dp.orderqty) like concat('%',:searchtext,'%')or trim(dp.totalcomqty) like concat('%',:searchtext,'%') )")
            Page<Dailyproduct> findAll(@Param("searchtext") String searchtext, Pageable of);


    //Query in Repository
    @Query("SELECT new Dailyproduct(d.id, d.totalcomqty, d.orderqty,d.currentcomqty, d.dailyqty, d.balanceqty, d.addeddate) FROM Dailyproduct as d where d.productionorder_id.id =:productionorderid and d.product_id.id=:productid order by d.id desc")
    List<Dailyproduct> qtyofselectedproduct(@Param("productionorderid") Integer productionorderid , @Param("productid") Integer productid);
}
