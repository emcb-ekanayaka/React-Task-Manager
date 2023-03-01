package com.printit.repository;

import com.printit.model.Purchaseorder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PorderRepository extends JpaRepository<Purchaseorder, Integer> {

    @Query("select p from Purchaseorder p where(p.pordercode like concat('%',:searchtext,'%')) or " +
            "trim(p.totalamount) like concat('%',:searchtext,'%') or   trim(p.addeddate) like concat('%',:searchtext,'%') or " +
            "p.supplier_id.companyname like concat('%',:searchtext,'%') or trim(p.requiredate) like concat('%',:searchtext,'%') or p.porderstatus_id.name like concat('%',:searchtext,'%')")
    Page<Purchaseorder> findAll(String searchtext, Pageable of);


    @Query(value = "SELECT concat('P' , lpad(substring(max(p.pordercode) , 2)+1 , '9' , '0')) FROM print_it.porder as p;" ,nativeQuery = true)
    String getNextNumber();


    //query for get porder with id , pordercode
    @Query("select new Purchaseorder (p.id , p.pordercode) from Purchaseorder p where p.porderstatus_id.name='Completed'")
    List<Purchaseorder> list();


    @Query("select p from Purchaseorder p where p.supplier_id.id =:supplierid AND p.porderstatus_id.name='Order'")
    List<Purchaseorder>purchaseorderlist(@Param("supplierid") Integer supplierid);
}
