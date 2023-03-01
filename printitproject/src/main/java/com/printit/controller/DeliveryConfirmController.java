package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.*;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController //To set the class readable
@RequestMapping(value = "/deliveryconfirm")
public class DeliveryConfirmController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private DeliveryRepository dao;

    @Autowired
    private DeliveryStatusRepository daostatus;

    @Autowired
    private DeliverhasCorderRepository daodeliverhascorder;

    @Autowired //
    private CustomerorderRepository daocustomerorder;

    @Autowired //
    private CorderhasproductRepository daocorderhasproduct;

    @Autowired //
    private CustomerorderstatusRepository daocustomerorderstatus;


   //post mapping for insert Quotation object
    @PutMapping
    public String insert(@RequestBody Delivery delivery) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "DELIVERYORDERCONFIRM");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try {
                boolean checkmaincustomerorderstatus = true;
                //Read inner table in the provided Delivery Object --> customerdeliveryconfirm object -----> delivery object
                    for(DeliveryHasCorder dho : delivery.getDeliveryHasCorderList()) {

                        // check that object has product value or corder value
                    if(dho.getProduct_id() == null && dho.getCorder_id() != null){

                        Customerorder co =  daocustomerorder.getById(dho.getCorder_id().getId());
                        for (CorderHasProduct cohp : co.getCorderHasProductList())
                            cohp.setCorder_id(co);

                        //get (customer-product)<--Inner form by given customer order and product order to-delivery
                        CorderHasProduct cop = daocorderhasproduct.getcorderproduct(co.getCustomer_id().getId(),dho.getProduct_id().getId());

                        // check the inner delivery-has-product status  ---- This inner delivery module status is provided in the delivery confirmation js
                        if (dho.getDeliverystatus_id().equals(daostatus.getById(1))){
                            // if this statement true customer order inner table status will change one by one
                            cop.setCorderstatus_id(daocustomerorderstatus.getById(9));
                            daocustomerorder.save(co);
                        }

                    }

                    //check that object has product value or corder value
                   if(dho.getProduct_id() != null && dho.getCorder_id() != null){

                       //Same as the first statement
                           Customerorder co =  daocustomerorder.getById(dho.getCorder_id().getId());
                           for (CorderHasProduct cohp : co.getCorderHasProductList())
                           cohp.setCorder_id(co);

                           CorderHasProduct cop = daocorderhasproduct.getcorderproduct(co.getId(),dho.getProduct_id().getId());

                       if (dho.getDeliverystatus_id().getId().equals(daostatus.getById(1).getId())){

                           cop.setCorderstatus_id(daocustomerorderstatus.getById(9));
                           daocustomerorder.save(co);
                       }

                    }


                        Customerorder co =  daocustomerorder.getById(dho.getCorder_id().getId());
                        for (CorderHasProduct cohp : co.getCorderHasProductList()){
                            if (cohp.getCorderstatus_id().getId().equals(daostatus.getById(2).getId())){
                                checkmaincustomerorderstatus=false;
                            }
                            if (checkmaincustomerorderstatus){
                                co.setCorderstatus_id(daocustomerorderstatus.getById(9));
                            }
                            cohp.setCorder_id(co);
                        }
                        daocustomerorder.save(co);

                }

                for (DeliveryHasCorder dhc : delivery.getDeliveryHasCorderList())
                    dhc.setDelivery_id(delivery);
                dao.save(delivery);
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }


}
