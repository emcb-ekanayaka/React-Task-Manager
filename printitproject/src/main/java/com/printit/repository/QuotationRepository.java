package com.printit.repository;

import com.printit.model.Quotation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuotationRepository extends JpaRepository<Quotation, Integer> {


   @Query("select q from Quotation q where(q.qno like concat('%',:searchtext,'%')) or " +
            "trim(q.reciveddate) like concat('%',:searchtext,'%') or   q.description like concat('%',:searchtext,'%') or " +
            "q.description like concat('%',:searchtext,'%') or q.quotationstatus_id.name like concat('%',:searchtext,'%') or " +
           "trim(q.validfrom) like concat('%',:searchtext,'%')")
    Page<Quotation> findAll(String searchtext, Pageable of);



    @Query(value = "SELECT concat('Q' , lpad(substring(max(q.qno),2)+1, '9', '0')) FROM print_it.quotation as q;" , nativeQuery = true)
            String getNextNumber();

    @Query("select new Quotation (q.id, q.qno) from Quotation q")
    List<Quotation> list();

    // list of valid quotation by selected supplier
    @Query("select q from Quotation q where q.supplier_id.id =:supplierid and q.quotationstatus_id.name='Valid' order by q.id desc")
    List<Quotation>quotationList(@Param("supplierid") Integer supplierid);
}
