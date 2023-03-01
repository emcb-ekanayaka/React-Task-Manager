package com.printit.controller;

import com.printit.model.Supplier;
import com.printit.repository.*;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController  //To set the class readable
@RequestMapping(value = "/report")
public class ReportController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private ReportCustomerPaymentRepository daoincomereport; // Income statement

    @Autowired
    private ReportSupplierPaymentRepository daoexpencesReport; // Expenses report

    @Autowired
    private ReportSupplierArrestRepository daoreportsuparrest;

    @Autowired
    private ReportDailyProductRepository daoDailyReport; // one by one product report

    @Autowired
    private ReportCustomerTypeRepository daoCustomertypeReport;

    @Autowired
    private ReportAllDailyProductRepository daoalldailyproductReport;

    @GetMapping(value = "/arrestamount", produces = "application/json")
    public List<Supplier> supplierarrestlist(){
        return daoreportsuparrest.supplierarrest();
    }

    //report/customerordertype?startdate=2022-04-27&enddate=2022-04-29
    @GetMapping(value = "/customerordertype",params ={"startdate", "enddate"}, produces = "application/json")
    public List customertypeList(@RequestParam("startdate") String startdate , @RequestParam("enddate") String enddate){
        return daoCustomertypeReport.customertype(startdate,enddate);
    }

    // report/byselecteddateofincome?startdate=2022-01-28&enddate=2022-04-03&type=Monthly
    @GetMapping(value = "/byselecteddateofincome" ,params ={"startdate", "enddate", "type"}, produces = "application/Json")
    public List byselecteddateofincome(@RequestParam("startdate") String startdate , @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        if (type.equals("Daily")) {
            return daoincomereport.dailyincome(startdate, enddate);
        }else
        if (type.equals("Weekly")){
            return daoincomereport.weeklyincome(startdate, enddate);
        }else
        if (type.equals("Monthly")){
            return daoincomereport.monthlyincome(startdate, enddate);
        }else
        if (type.equals("Annual")){
            return daoincomereport.anualyincome(startdate, enddate);
        }else
            return null;
    }

    // report/byselecteddateofdailyproduct?productName=500 ml Water Bottle White&startDate=2022-01-28&endDate=2022-04-03&type=Daily
    @GetMapping(value = "/byselecteddateofdailyproduct" ,params ={"productName", "startDate", "endDate", "type"}, produces = "application/Json")
    public List byselecteddateofproducttype(@RequestParam("productName") String productName , @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate, @RequestParam("type") String type){

        if (type.equals("Daily")) {
            return daoDailyReport.dailyproduct(productName,startDate, endDate);
        }else
        if (type.equals("Weekly")){
            return daoDailyReport.weeklyproduct(productName,startDate, endDate);
        }else
        if (type.equals("Monthly")){
            return daoDailyReport.monthlyproduct(productName,startDate, endDate);
        }else
        if (type.equals("Annual")){
            return daoDailyReport.annuallyproduct(productName,startDate, endDate);
        }else
            return null;
    }

    // report/byselecteddateofAlldailyproduct?startDate=2022-04-27&endDate=2022-04-28
    @GetMapping(value = "/byselecteddateofAlldailyproduct", produces = "application/json")
    public List byselecteddateofAlldailyproductList( @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate){
        return daoalldailyproductReport.dailyallproduct(startDate, endDate);
    }

    // report/byselecteddateofexpenses?startdate=2022-04-26&enddate=2022-04-26&type=Monthly
    @GetMapping(value = "/byselecteddateofexpenses" ,params ={"startdate", "enddate", "type"}, produces = "application/Json")
    public List byselecteddateofexpenses(@RequestParam("startdate") String startdate , @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        if (type.equals("Daily")) {
            return daoexpencesReport.dailyexpenses(startdate, enddate);
        }else
        if (type.equals("Weekly")){
            return daoexpencesReport.weeklyexpenses(startdate, enddate);
        }else
        if (type.equals("Monthly")){
            return daoexpencesReport.monthlyexpenses(startdate, enddate);
        }else
        if (type.equals("Annual")){
            return daoexpencesReport.anualyexpenses(startdate, enddate);
        }else
            return null;
    }


    // notification for mainwindow of supplier cheque dates
    //report/notificationofchequedates
    @GetMapping(value = "/notificationofchequedates", produces = "application/json")
    public List notificationofchequedates(){
        return daoexpencesReport.notificationforsuppliercheque();
    }

}
