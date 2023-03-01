package com.printit.controller;

import com.printit.model.CorderHasProduct;
import com.printit.repository.CorderhasproductRepository;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController  //To set the class readable
@RequestMapping(value = "/customerorderhasproduct")
public class CustomerorderHasProductController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private CorderhasproductRepository dao;

    //to invoice
    @GetMapping(value = "/listofproductforinvoice" ,params = "customerorderid", produces = "application/Json")
    public List<CorderHasProduct> customerorderlistbycustomer(@RequestParam("customerorderid") int customerorderid){
        return dao.listofproducttoinvice(customerorderid);
    }

    //to deliver when selecting a corder all delivery details should be phase to database-->cpname, cpmobile, address
    @GetMapping(value = "/listofcorderdeliverdetails" ,params = "customerorderid", produces = "application/Json")
    public List<CorderHasProduct> setcorderdetailtodeliver(@RequestParam("customerorderid") int customerorderid){
        return dao.listofdeliverydetails(customerorderid);
    }

    //to deliver when selecting a corder all delivery details should be phase to database-->cpname, cpmobile, address
    @GetMapping(value = "/listofcorderproductdeliverdetails" ,params = {"customerorderid","productid"}, produces = "application/Json")
    public List<CorderHasProduct> setcorderdetailtodeliver(@RequestParam("customerorderid") Integer customerorderid, @Param("productid") Integer productid){
        return dao.listofdeliverydetailsoncorderproduct(customerorderid, productid);
    }

    //in delivery confirm to get the all qty, contact person name, contact mobile number, address
    @GetMapping(value = "/listofproductqty" ,params = {"customerorderid", "productid"}, produces = "application/Json")
    public List<CorderHasProduct> customerorderlistbycustomer(@RequestParam("customerorderid") int customerorderid, @RequestParam("productid") int productid){
        return dao.listofproductofqty(customerorderid,productid);
    }


}
