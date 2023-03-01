package com.printit.controller;


import com.printit.model.CorderHasProduct;
import com.printit.repository.CustomerHasProductRepository;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/customerhasproduct")
public class CustomerHasProductController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private CustomerHasProductRepository dao;

    //Get Request For Product list by Customer Order  {/customerhasproduct/listbyproduct?productid=1}
    @GetMapping(value = "/listbyproduct" ,params = {"customerid"}, produces = "application/Json")
    public List<CorderHasProduct> corderHasProductList(@RequestParam("customerid") int customerid){
        return dao.listbyproduct(customerid);
    }

    //Get Request For Product list by Customer Order  {/customerhasproduct/listbyproduct?productid=1}
    @GetMapping(value = "/listbyproduct" ,params = {"customerid", "productid"}, produces = "application/Json")
    public CorderHasProduct corderProductList(@RequestParam("customerid") int customerid, @RequestParam("productid") int productid){
        return dao.listbyproductandorder(customerid,productid);
    }


}
