package com.printit.repository;

import com.printit.model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UnitlRepository extends JpaRepository<Unit, Integer> {

    @Query("select u from Unit u where u.materialcategory_id.id=:materialid")
    List<Unit>ListByMaterial( @Param("materialid") Integer materialid);
}
