package com.printit.repository;

import com.printit.model.Productcostanalysis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductCostAnalysisRepository extends JpaRepository<Productcostanalysis, Integer> {

    @Query("select pa from Productcostanalysis pa where (trim(pa.profitratio) like concat('%',:searchtext,'%') or " +
            "pa.employee_id.callingname like concat('%',:searchtext,'%') or trim(pa.addeddate) like concat('%',:searchtext,'%') or " +
            "pa.description like concat('%',:searchtext,'%') or trim(pa.productioncost) like concat('%',:searchtext,'%') or trim(pa.validfrom) like concat('%',:searchtext,'%') or " +
            "pa.product_id.productname like concat('%',:searchtext,'%')or trim(pa.materialcost) like concat('%',:searchtext,'%') or trim(pa.validto) like concat('%',:searchtext,'%') or pa.pcoststatus_id.name like concat('%',:searchtext,'%'))")
            Page<Productcostanalysis> findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query(value = "SELECT concat('PCA', lpad(substring(max(pc.productcostanalysiscode), 4)+1 , '7', '0')) FROM print_it.productcostanalysis as pc;" , nativeQuery = true)
    String getNextNumber();

    /*@Query("select new Productcostanalysis(pca.id, pca.validto) from Productcostanalysis pca where pca.product_id.id=:productid order by pca.id desc")
    List<Productcostanalysis> getListByProduct(@Param("productid") int productid);*/
}
