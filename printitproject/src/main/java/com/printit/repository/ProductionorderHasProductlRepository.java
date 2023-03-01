package com.printit.repository;


import com.printit.model.ProductionorderHasProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ProductionorderHasProductlRepository extends JpaRepository<ProductionorderHasProduct, Integer> {

    // get ordered quantity of customer by selecting product in daily production UI
    @Query("select pro from ProductionorderHasProduct pro where pro.productionorder_id.id =:productionorderid and pro.product_id.id=:productid")
    ProductionorderHasProduct qtybyproduct(@Param("productionorderid") Integer productionorderid ,@Param("productid") Integer productid );



}
