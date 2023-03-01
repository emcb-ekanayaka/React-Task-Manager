package com.printit.repository;

import com.printit.model.Supplierpayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SupplierPaymentRepository extends JpaRepository<Supplierpayment, Integer> {

    @Query("select sp from Supplierpayment sp where (sp.description like concat('%',:searchtext,'%') or " +
            "sp.supplier_id.companyname like concat('%',:searchtext,'%') or trim(sp.totalamount) like concat('%',:searchtext,'%') or " +
            "trim(sp.balanceamount) like concat('%',:searchtext,'%') or sp.bankaccname like concat('%',:searchtext,'%') or sp.bankbranchname like concat('%',:searchtext,'%') or " +
            "trim(sp.billno) like concat('%',:searchtext,'%')or trim(sp.chequedate) like concat('%',:searchtext,'%') or sp.spaystatus_id.name like concat('%',:searchtext,'%'))")
            Page<Supplierpayment> findAll(@Param("searchtext") String searchtext, Pageable of);

   @Query(value = "SELECT concat('SP', lpad(substring(max(sp.billno), 3)+1 , '8', '0')) FROM print_it.supplierpayment as sp;" , nativeQuery = true)
    String getNextNumber();

/*    //query for get supplier with id , companyname , creditlimit , arrestamount
    @Query("select new Supplier(s.id , s.companyname, s.creditlimit, s.arrestamount) from Supplier s where s.supplierstatus_id.name='Active'")
    List<Supplier> list();*/
}
