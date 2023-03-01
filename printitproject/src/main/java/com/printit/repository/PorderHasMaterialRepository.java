package com.printit.repository;


import com.printit.model.PorderHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface PorderHasMaterialRepository extends JpaRepository<PorderHasMaterial, Integer> {

    @Query("select phm from PorderHasMaterial phm where phm.material_id.id =:materialid and phm.porder_id.id=:porderid")
    PorderHasMaterial listbypordermaterial(@Param("porderid") Integer porderid , @Param("materialid") Integer materialid);
}
