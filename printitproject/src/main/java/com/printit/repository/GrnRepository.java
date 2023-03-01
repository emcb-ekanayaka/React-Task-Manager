package com.printit.repository;

import com.printit.model.Grn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

//JPArepo interface has many function, that's why we and import and use it as extends
public interface GrnRepository extends JpaRepository <Grn, Integer> {

    @Query("select g from Grn g where(g.grncode like concat('%',:searchtext,'%') or " +
            "trim(g.addeddate) like concat('%',:searchtext,'%') or g.description like concat('%',:searchtext,'%') or " +
            "g.employee_id.callingname like concat('%',:searchtext,'%') or trim(g.discountratio) like concat('%',:searchtext,'%') or " +
            "trim(g.grandtotal) like concat('%',:searchtext,'%') or trim(g.nettotal) like concat('%',:searchtext,'%') or g.grnstatus_id.name like concat('%',:searchtext,'%') or " +
            "trim(g.paidamount) like concat('%',:searchtext,'%') or trim(g.nettotal) like concat('%',:searchtext,'%') or " +
            "g.supplierbillno like concat('%',:searchtext,'%') or trim(g.recieveddate) like concat('%',:searchtext,'%'))")
    Page<Grn> findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query(value = "SELECT concat('G', lpad(substring(max(g.grncode),2)+1 , '9','0')) FROM print_it.grn as g;" , nativeQuery = true)
    String getNextNumber();

    //Query in Repository
    @Query("select gr from Grn gr where gr.supplier_id.id=:supplierid and gr.grnstatus_id.name ='Pending' order by gr.id desc")
    List<Grn>grnList(@Param("supplierid") Integer supplierid);

    //query for get Grn with id , grncode
    @Query("select new Grn (g.id, g.grncode,g.grandtotal,g.nettotal) from Grn g where g.grnstatus_id.name='Pending'")
    List<Grn> list();

}
