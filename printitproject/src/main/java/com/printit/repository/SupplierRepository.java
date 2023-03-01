package com.printit.repository;

import com.printit.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier , Integer> {

    @Query("select s from Supplier s where (s.suppliercode like concat('%',:searchtext,'%') or " +
            "s.companyname like concat('%',:searchtext,'%') or s.supplierstatus_id.name like concat('%',:searchtext,'%') or " +
            "s.bankacco like concat('%',:searchtext,'%') or s.bankaccname like concat('%',:searchtext,'%') or s.bankbranchname like concat('%',:searchtext,'%') or " +
            "s.cpname like concat('%',:searchtext,'%')or s.email like concat('%',:searchtext,'%') or s.cpmobile like concat('%',:searchtext,'%'))")
            Page<Supplier> findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query(value = "SELECT concat('S' ,lpad(substring(max(s.suppliercode), 2) +1 , '9', '0')) FROM print_it.supplier as s;" , nativeQuery = true)
    String getNextNumber();

    //query for get supplier with id , companyname , creditlimit , arrestamount
    @Query("select new Supplier(s.id , s.companyname, s.creditlimit, s.arrestamount) from Supplier s where s.supplierstatus_id.name='In-Active'")
    List<Supplier> list();

    //Query in Repository to check duplicated Supplier Email
    @Query("select s from Supplier s where s.email=:email")
    Supplier findByemail(@Param("email") String email);

    //Query in Repository to check duplicated Supplier LandNumber
    @Query("select s from Supplier s where s.landno=:landnumber")
    Supplier findBylandnumber(@Param("landnumber") String landnumber);
}
