package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.CustomerPaymentRepository;
import com.printit.repository.CustomerRepository;
import com.printit.repository.CustomerorderRepository;
import com.printit.repository.CustomerorderstatusRepository;
import com.printit.service.EmailService;
import com.printit.service.SMSService;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;

@RestController //To set the class readable
@RequestMapping (value = "/customerpayment")  //set the mapping for this class
public class CustomerpaymentController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired // to get a instance
    private PrevilageController previlageController;

    @Autowired //To create a Instence for this
    private CustomerPaymentRepository dao;

    @Autowired //To create a Instence for this
    private CustomerorderRepository daocorder;

    @Autowired //To create a Instence for this
    private CustomerorderstatusRepository daocorderstatus;

    @Autowired //To create a Instence for this
    private CustomerRepository daocustomer;

    @Autowired // to get a instance
    private SMSService serviceSms;

    @Autowired // to get a instance
    private EmailService emailService;

    // to mainwindow to get the customer payment by selected customer order
    @GetMapping(value = "/listbycustomerpayment" ,params = "customerorderid", produces = "application/Json")
    public CustomerPayment customerorderlistbycustomer(@RequestParam("customerorderid") int customerorderid){
        return dao.customerpaymentdetails(customerorderid);
    }

    //Get Next Number
    @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public CustomerPayment nextNumber(){
        String nextNumber = dao.getNextNumber();
        CustomerPayment nextCustomer = new CustomerPayment(nextNumber);
        return nextCustomer;
    }

    //Get Request Mapping For Get Customer page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<CustomerPayment> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMERPAYMENT");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Customer page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<CustomerPayment> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMERPAYMENT");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
        return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

   //post mapping for insert custoer object
    @PostMapping
    public String insert(@RequestBody CustomerPayment customerpayment) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERPAYMENT");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {

                //set the customer payment --> paid amount to the  customer order ---> paid amount
                Customerorder co = daocorder.getById(customerpayment.getCorder_id().getId());
                co.setCorderstatus_id(daocorderstatus.getById(7)); // 7 - set corder status To Paid status
                co.setPaidamount(co.getPaidamount().add(customerpayment.getPaidamount())); // add paid amount if its available in the corder table
                co.setAdvaceamount(BigDecimal.valueOf(0.00)); // set advance payment to 0.00 if customer pay

                for (CorderHasProduct cop : co.getCorderHasProductList())
                    cop.setCorder_id(co);

               /* Customer cus = daocustomer.getById(customerpayment.getCustomer_id().getId());
                SMS sms = new SMS();
                sms.setTo("+94768601324");
                sms.setTo("+94" + cus.getMobile().substring(1));
                sms.setMessage("Your Payment Successfully Received");
                serviceSms.send(sms);*/
                //emailService.sendMail("chathurangabdr@gmail.com","New Product Added","Product Added Successfully");

                dao.save(customerpayment);
                daocorder.save(co);

                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

     //post mapping for customer object
    @PutMapping
    public String update(@RequestBody CustomerPayment customerpayment){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERPAYMENT");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
        try{
            dao.save(customerpayment);
            return "0";
        }catch (Exception ex){
            return "Update not completed "+ex.getMessage();
        }
        } else
            return "error update..! You Have No Privilage...";
    }

   //Delete mapping for custoer object
    @DeleteMapping
    public String delete(@RequestBody CustomerPayment customerpayment){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERPAYMENT");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
        try{
            dao.save(customerpayment);
            return "0";
        }catch (Exception ex){
            return "Delete not completed "+ex.getMessage();
        }
        } else
            return "error deleting..! You Have No Privilage...";
    }
}