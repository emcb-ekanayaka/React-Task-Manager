package com.printit.repository;

import com.printit.model.CorderHasProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CorderhasproductRepository extends JpaRepository<CorderHasProduct, Integer> {

    // get ordered quantity of customer by selecting product in daily production UI
    @Query("select cohp from CorderHasProduct cohp where cohp.product_id.id =:productid and cohp.corder_id.id = :corderid")
    CorderHasProduct qtybycustomerproduct(@Param("productid") Integer productid , @Param("corderid") Integer corderid );

    //to invoice
    @Query("select chp from CorderHasProduct chp where chp.corder_id.id=:customerorderid")
    List<CorderHasProduct>listofproducttoinvice(@Param("customerorderid") Integer customerorderid);

    //to deliver when selecting a corder all delivery details should be phase to database-->cpname, cpmobile, address
    @Query("select chp from CorderHasProduct chp where chp.corder_id.id=:customerorderid")
    List<CorderHasProduct>listofdeliverydetails(@Param("customerorderid") Integer customerorderid);

    //to deliver when selecting a corder and product all delivery details should be phase to database-->cpname, cpmobile, address
    @Query("select chp from CorderHasProduct chp where chp.corder_id.id=:customerorderid and chp.product_id.id=:productid")
    List<CorderHasProduct>listofdeliverydetailsoncorderproduct(@Param("customerorderid") Integer customerorderid, @Param("productid") Integer productid);

    //in delivery confirm to get the all qty, contact person name, contact mobile number, address
    @Query("select chp from CorderHasProduct chp where chp.corder_id.id=:customerorderid and chp.product_id.id =:productid")
    List<CorderHasProduct> listofproductofqty(@Param("customerorderid") Integer customerorderid,@Param("productid") Integer productid);


    // Unique customer order product for delivery-confirmation while selecting customer order wise
    @Query("select chp from CorderHasProduct chp where chp.corder_id.id=:customerorderid and chp.product_id.id =:productid")
    CorderHasProduct getcorderproduct(@Param("customerorderid") Integer customerorderid,@Param("productid") Integer productid);


}
