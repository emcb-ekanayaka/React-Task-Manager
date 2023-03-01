package com.printit.repository;

import com.printit.model.Materialinventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MaterialInventoryRepository extends JpaRepository<Materialinventory, Integer> {

    @Query("select mi from Materialinventory mi where(mi.material_id.materialname like concat('%',:searchtext,'%')) or " +
            "trim(mi.avaqty) like concat('%',:searchtext,'%') or trim(mi.totalqty) like concat('%',:searchtext,'%') or " +
            "mi.inventorystatus_id.name like concat('%',:searchtext,'%')")
    Page<Materialinventory> findAll(String searchtext, Pageable of);

    // list of valid quotation by selected supplier
    @Query("select miv from Materialinventory miv where miv.material_id.id =:materialid")
    Materialinventory listbymaterial(@Param("materialid") Integer materialid);

    //
    @Query("select miv from Materialinventory miv where miv.material_id.id =:materialid")
    Materialinventory byMaterial(@Param("materialid") Integer materialid);

}
