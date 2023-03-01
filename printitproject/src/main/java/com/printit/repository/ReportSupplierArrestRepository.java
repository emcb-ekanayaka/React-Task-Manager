package com.printit.repository;

import com.printit.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportSupplierArrestRepository extends JpaRepository<Supplier, Integer> {

    //@Query("SELECT new Customerorder (count(c.customertype_id), c.customertype_id) FROM Customerorder c group by c.customertype_id")
    @Query("select new Supplier(s.companyname, s.arrestamount) from Supplier s")
    List<Supplier> supplierarrest();

}
