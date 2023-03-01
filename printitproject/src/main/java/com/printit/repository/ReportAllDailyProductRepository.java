package com.printit.repository;


import com.printit.model.Dailyproduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportAllDailyProductRepository extends JpaRepository<Dailyproduct, Integer>{

    //query for all daily product report
    @Query(value = "SELECT dp.id, producttype.name, year(dp.addeddate), monthname(dp.addeddate), day(dp.addeddate), dayname(dp.addeddate), sum(dp.dailyqty)\n" +
            "FROM print_it.dailyproduct as dp\n" +
            "join product on product.id = dp.product_id\n" +
            "join producttype on producttype.id = product.producttype_id\n" +
            "where dp.addeddate between ?1 and ?2 group by dp.product_id ;", nativeQuery = true)
    List dailyallproduct (String startDate, String endDate);

}
