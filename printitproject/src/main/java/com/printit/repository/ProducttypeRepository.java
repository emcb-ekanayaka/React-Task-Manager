package com.printit.repository;

import com.printit.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProducttypeRepository extends JpaRepository<Producttype, Integer> {

    @Query("select pdt from Producttype pdt where(pdt.name like concat('%',:searchtext,'%') or " +
            "concat(pdt.profitratio,'') like concat('%',:searchtext,'%') or pdt.dtype_id.name like concat('%',:searchtext,'%') or " +
            "pdt.productcost like concat('%',:searchtext,'%') or pdt.photoname like concat('%',:searchtext,'%'))")
    Page<Producttype> findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query("select p from Producttype p where p.dtype_id.id=:designtype")
    List<Producttype> listByDesigntype(@Param("designtype") Integer designtype);

    @Query("SELECT new Producttype (pt.id,pt.name) FROM Producttype pt")
    List<Producttype> webproducttypelist();

    @Query("select new Producttype(p.id , p.producttypephoto, p.dtype_id, p.photoname) from Producttype p")
    List<Producttype> webviewlist();

}
