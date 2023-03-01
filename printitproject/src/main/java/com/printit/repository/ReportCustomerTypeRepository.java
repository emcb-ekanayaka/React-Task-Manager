package com.printit.repository;

import com.printit.model.Customerorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportCustomerTypeRepository extends JpaRepository<Customerorder, Integer> {

    // Report Of the customer Type
    @Query(value = "SELECT customertype.name,count(c.id) FROM print_it.corder as c \n" +
            "join customertype on customertype.id = c.customertype_id\n" +
            "where c.addeddate between ?1 and ?2 group by name",nativeQuery = true)
    List customertype(String startdate,String enddate);

}
