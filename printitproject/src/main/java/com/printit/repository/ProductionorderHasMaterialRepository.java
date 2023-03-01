package com.printit.repository;


import com.printit.model.ProductionorderHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ProductionorderHasMaterialRepository extends JpaRepository<ProductionorderHasMaterial, Integer> {

    @Query("select prom from ProductionorderHasMaterial prom where prom.productionorder_id.id =:productionorderid")
    ProductionorderHasMaterial productionorderhasmaterial(@Param("productionorderid") Integer productionorderid);
}
