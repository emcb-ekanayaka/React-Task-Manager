package com.printit.repository;

import com.printit.model.ProductHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductHasMaterialRepository extends JpaRepository<ProductHasMaterial, Integer> {

    @Query("select phm from ProductHasMaterial phm where phm.product_id.id=:productid")
    List<ProductHasMaterial> listbyproduct(@Param("productid") Integer productid);



}
