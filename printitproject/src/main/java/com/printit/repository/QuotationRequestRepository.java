package com.printit.repository;

import com.printit.model.Quotationrequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuotationRequestRepository extends JpaRepository<Quotationrequest, Integer> {

   @Query("select qr from Quotationrequest qr where(qr.qrno like concat('%',:searchtext,'%')) or " +
            "trim(qr.addeddate) like concat('%',:searchtext,'%') or   qr.description like concat('%',:searchtext,'%') or " +
            "qr.supplier_id.companyname like concat('%',:searchtext,'%') or qr.qrstatus_id.name like concat('%',:searchtext,'%') or " +
           "qr.employee_id.callingname like concat('%',:searchtext,'%')")
    Page<Quotationrequest> findAll(String searchtext, Pageable of);


    @Query(value = "SELECT concat('QR' ,lpad(substring(max(qr.qrno),3)+1,'8','0')) FROM print_it.quotationrequest as qr;" , nativeQuery = true)
            String getNextNumber();

    @Query("select new Quotationrequest(q.id ,q.qrno) from Quotationrequest q")
    List<Quotationrequest> list();

    //get Requested quotation requests by selecting a supplier
    @Query(value = "SELECT qr from Quotationrequest qr where qr.supplier_id.id=:supplierid and qr.qrstatus_id.name='Requested'")
    List<Quotationrequest>ListBySupplier(@Param("supplierid") Integer supplierid);


}
