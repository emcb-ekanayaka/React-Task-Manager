package com.printit.repository;


import com.printit.model.Dailyproduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportDailyProductRepository extends JpaRepository<Dailyproduct, Integer>{

    //query for daily product report
    @Query(value = "SELECT  d.id, dayname(d.addeddate), producttype.name, sum(d.dailyqty) FROM print_it.dailyproduct as d\n" +
            "join product on product.id = d.product_id\n" +
            "join producttype on producttype.id = product.producttype_id\n" +
            "where producttype.name=?1 and d.addeddate between ?2 and ?3\n" +
            "group by dayname(d.addeddate);", nativeQuery = true)
    List dailyproduct (String productName, String startDate, String endDate);

    //query for weekly product report
    @Query(value = "SELECT  d.id, week(d.addeddate), producttype.name, sum(d.dailyqty) FROM print_it.dailyproduct as d\n" +
            "join product on product.id = d.product_id\n" +
            "join producttype on producttype.id = product.producttype_id\n" +
            "where producttype.name=?1 and d.addeddate between ?2 and ?3\n" +
            "group by week(d.addeddate);", nativeQuery = true)
    List weeklyproduct(String productName, String startDate, String endDate);

    //query for monthly product report
    @Query(value = "SELECT  d.id, monthname(d.addeddate), producttype.name, sum(d.dailyqty) FROM print_it.dailyproduct as d\n" +
            "join product on product.id = d.product_id\n" +
            "join producttype on producttype.id = product.producttype_id\n" +
            "where producttype.name=?1 and d.addeddate between ?2 and ?3\n" +
            "group by monthname(d.addeddate);", nativeQuery = true)
    List monthlyproduct(String productName, String startDate, String endDate);

    //query for annually product report
    @Query(value = "SELECT  d.id, year(d.addeddate), producttype.name, sum(d.dailyqty) FROM print_it.dailyproduct as d\n" +
            "join product on product.id = d.product_id\n" +
            "join producttype on producttype.id = product.producttype_id\n" +
            "where producttype.name=?1 and d.addeddate between ?2 and ?3\n" +
            "group by year(d.addeddate);", nativeQuery = true)
    List annuallyproduct(String productName, String startDate, String endDate);
}
