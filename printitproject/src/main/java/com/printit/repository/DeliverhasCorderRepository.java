package com.printit.repository;

import com.printit.model.DeliveryHasCorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeliverhasCorderRepository extends JpaRepository<DeliveryHasCorder, Integer> {


 /*   @Query("select new DeliveryHasCorder (dho.id , dho.deliverystatus_id) from DeliveryHasCorder dho where dho.delivery_id=:deliveryid and dho.corder_id=:corderid and dho.product_id=:productid")
    List<DeliveryHasCorder> list();*/

    //to delivery confirmation moduel
    @Query("SELECT dhc FROM DeliveryHasCorder dhc where dhc.corder_id.id=:customerorderid and dhc.deliverystatus_id.name='In-Delivered' order by dhc.id desc")
    List<DeliveryHasCorder> listofdeliveryhascorder(@Param("customerorderid") Integer customerorderid);

/*
    //list of delivery details for main window
    @Query("SELECT dhc FROM DeliveryHasCorder dhc where dhc.corder_id.id=:customerorderid and dhc.product_id.id=:productid")
    List<DeliveryHasCorder> listofdeliverydetailsformainwindow(@Param("customerorderid") Integer customerorderid,@Param("productid") Integer productid);*/
}
