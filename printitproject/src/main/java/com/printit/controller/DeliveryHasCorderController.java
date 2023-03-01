package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.*;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/deliveryhascorder")
public class DeliveryHasCorderController {

    @Autowired //To create a Instence for this
    private DeliveryRepository dao;

    @Autowired //To create a Instence for this
    private DeliverhasCorderRepository daodeliveryhasorder;

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private DeliverhasCorderRepository daodeliverhascorder;


    @GetMapping(value = "/listofdeliverycorders" ,params = {"customerorderid"}, produces = "application/Json")
    public List<DeliveryHasCorder> customerList(@RequestParam("customerorderid") int customerorderid){
        return daodeliveryhasorder.listofdeliveryhascorder(customerorderid);
    }


  /*  // this is for main window to get the delivery information
    //deliveryhascorder/listofdeliverydetails?customerorderid=1&productid=2
    @GetMapping(value = "/listofdeliverydetails" ,params = {"customerorderid","productid"}, produces = "application/Json")
    public List<DeliveryHasCorder> customerList(@RequestParam("customerorderid") int customerorderid,@RequestParam("productid") int productid){
        return daodeliveryhasorder.listofdeliverydetailsformainwindow(customerorderid,productid);
    }*/

}
