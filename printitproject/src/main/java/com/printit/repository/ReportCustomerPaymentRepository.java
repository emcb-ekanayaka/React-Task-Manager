package com.printit.repository;

import com.printit.model.CustomerPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportCustomerPaymentRepository extends JpaRepository<CustomerPayment, Integer> {

    // Daily income
    @Query(value = "SELECT year(cp.paiddatetime),date(cp.paiddatetime),sum(cp.orderamount)\n" +
            "FROM print_it.cpayment as cp where date(cp.paiddatetime) between ?1 and ?2 group by dayname(cp.paiddatetime);", nativeQuery = true)
    List dailyincome(String startdate, String enddate);

    // Weekly income
    @Query(value = "SELECT year(cp.paiddatetime), week(cp.paiddatetime),sum(cp.orderamount) FROM print_it.cpayment as cp where date(cp.paiddatetime) between ?1 and ?2 group by week(cp.paiddatetime);", nativeQuery = true)
    List weeklyincome(String startdate, String enddate);

    // monthly income
    @Query(value = "SELECT year(cp.paiddatetime),monthname(cp.paiddatetime), sum(cp.orderamount) FROM print_it.cpayment as cp where date(cp.paiddatetime) between ?1 and ?2 group by month(cp.paiddatetime);", nativeQuery = true)
    List monthlyincome(String startdate, String enddate);

    // anualy income
    @Query(value = "SELECT year(cp.paiddatetime),year(cp.paiddatetime),sum(cp.orderamount)\n" +
            "FROM print_it.cpayment as cp where date(cp.paiddatetime) between ?1 and ?2 group by year(cp.paiddatetime);", nativeQuery = true)
    List anualyincome(String startdate, String enddate);

}
