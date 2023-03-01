package com.printit.repository;

import com.printit.model.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ColorRepository extends JpaRepository<Color, Integer> {

    @Query("select c from Color c where c.materialcategory_id.id=:materialcategoryid")
    List<Color>ListByColor(@Param("materialcategoryid") Integer materialcategoryid);

}
