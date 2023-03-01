package com.printit.repository;

import com.printit.model.CorderHasProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerHasProductRepository extends JpaRepository<CorderHasProduct, Integer> {

    @Query("select chp from CorderHasProduct chp where chp.corder_id.id=:customerid")
    List<CorderHasProduct> listbyproduct(@Param("customerid") Integer customerid);

    @Query("select chp from CorderHasProduct chp where chp.corder_id.id=:customerid and chp.product_id.id=:productid")
    CorderHasProduct listbyproductandorder (@Param("customerid") Integer customerid, @Param("productid") Integer productid);
}
