package com.printit.repository;

import com.printit.model.Productdesigntype;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductdesignRepository extends JpaRepository<Productdesigntype, Integer> {

    @Query("select p from Productdesigntype p where (p.designcode like concat('%',:searchtext, '%') or " +
            "p.designname like concat('%',:searchtext, '%') or p.dstatus_id.name like concat('%',:searchtext, '%') or " +
            "trim(p.designcost) like concat('%',:searchtext, '%') or p.dtype_id.name like concat('%',:searchtext, '%') or " +
            "p.dcategory_id.name like concat('%',:searchtext, '%') or p.dtype_id.name like concat('%',:searchtext, '%'))")
    Page<Productdesigntype> findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query(value = "SELECT concat('D', lpad(substring(max(d.designcode),2)+1 , '9', '0')) FROM print_it.designtype as d;" , nativeQuery = true)
    String getNextNumber();

    @Query("SELECT pd FROM Productdesigntype pd where pd.dtype_id.id=:designtypeid and pd.dstatus_id.name='Pending' order by pd.id desc")
    List<Productdesigntype> listofdesingcode(@Param("designtypeid") Integer designtypeid);

    @Query("select new Productdesigntype (pd.id, pd.designcode) from Productdesigntype pd")
    List<Productdesigntype> webDesignList();
}
