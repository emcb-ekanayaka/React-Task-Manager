package com.printit.repository;

import com.printit.model.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SizeRepository extends JpaRepository<Size, Integer> {

    @Query("select s from Size s where s.materialcategory_id.id=:materialcategoryid")
    List<Size> ListBySize(@Param("materialcategoryid") Integer materialcategoryid);
}
