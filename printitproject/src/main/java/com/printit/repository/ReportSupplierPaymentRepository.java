package com.printit.repository;

import com.printit.model.Supplierpayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportSupplierPaymentRepository extends JpaRepository<Supplierpayment, Integer> {

    // Daily expenses
    @Query(value = "SELECT year(sp.paiddate), date(sp.paiddate), sum(sp.paidamount)\n" +
            "FROM print_it.supplierpayment as sp where date(sp.paiddate) between ?1 and ?2 group by day(sp.paiddate);", nativeQuery = true)
    List dailyexpenses(String startdate, String enddate);

    // Weekly expenses
    @Query(value = "SELECT year(sp.paiddate), week(sp.paiddate), sum(sp.paidamount)\n" +
            "FROM print_it.supplierpayment as sp where date(sp.paiddate) between ?1 and ?2 group by week(sp.paiddate);", nativeQuery = true)
    List weeklyexpenses(String startdate, String enddate);

    // monthly expenses
    @Query(value = "SELECT year(sp.paiddate), monthname(sp.paiddate), sum(sp.paidamount)\n" +
            "FROM print_it.supplierpayment as sp where date(sp.paiddate) between ?1 and ?2 group by month(sp.paiddate);", nativeQuery = true)
    List monthlyexpenses(String startdate, String enddate);

    // anualy expenses
    @Query(value = "SELECT year(sp.paiddate), year(sp.paiddate), sum(sp.paidamount)\n" +
            "FROM print_it.supplierpayment as sp where date(sp.paiddate) between ?1 and ?2 group by year(sp.paiddate);", nativeQuery = true)
    List anualyexpenses(String startdate, String enddate);


    //notification for supplier cheques
    @Query(value = "SELECT sp.id, count(sp.billno),sp.chequedate, sp.paidamount, supplier.companyname FROM print_it.supplierpayment as sp \n" +
            "join supplier on supplier.id=sp.supplier_id\n" +
            "where sp.chequedate >= curdate() and sp.chequedate <= (curdate() + interval 21 day) group by supplier.companyname;", nativeQuery = true)
    List notificationforsuppliercheque();



}
