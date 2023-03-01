package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.CustomerRepository;
import com.printit.repository.CustomerstatusRepository;
import com.printit.service.SMSService;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController //To set the class readable --> all services should be set in serveralert controller
@RequestMapping (value = "/customer")  //set the mapping for this class
public class CustomerController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired // to get a instance
    private PrevilageController previlageController;

    @Autowired //To create a Instence for this
    private CustomerRepository dao;

    @Autowired //To create a Instence for this
    private SMSService serviceSms;

    @Autowired //To create a Instence for this
    private CustomerstatusRepository daosatus;

    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Customer> customerList(){
        return dao.list();
    }

    //get customer list service
    @GetMapping(value = "/listbyCustomertype" ,params = {"customertypeid"}, produces = "application/Json")
    public List<Customer> customerList(@RequestParam("customertypeid") int customertypeid){
        return dao.listbyCustomertype(customertypeid);
    }

    //Get Next Number
    @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Customer nextNumber(){
        String nextNumber = dao.getNextNumber();
        Customer nextCustomer = new Customer(nextNumber);
        return nextCustomer;
    }

    //Get Request Mapping For Get Customer page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Customer> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMER");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Customer page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Customer> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMER");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
        return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //post mapping for insert custoer object
    @PostMapping
    public String insert(@RequestBody Customer customer) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");

        //check user null
        if (user != null && priv != null && priv.get("add")) {

            //2 ---> rental
            if (customer.getCustomertype_id().getId().equals(2)){
                System.out.println("A");

                Customer extcusemail   = dao.excustomeremail(customer.getEmail());
                Customer extlandnumber   = dao.exlandnumber(customer.getLand());
                Customer extfaxnumber   = dao.exfaxNumber(customer.getCfax());
                Customer extcustomer   = dao.listofcustomernumbers(customer.getMobile());

                if (extcusemail != null){
                    return "Error Validation : Duplicate Email Address...";
                }else if (extlandnumber != null){
                      return "Error Validation : Duplicate Land Number...";
                }else if (extfaxnumber != null){
                      return "Error Validation : Duplicate Fax Number...";
                }else if (extcustomer != null){
                    return "Error Validation : Duplicate Mobile Number...";
                }
            }
            //1 ---> whole
            if (customer.getCustomertype_id().getId().equals(1)){
                Customer extindividualcusemail   = dao.exwholecustomeremail(customer.getCemail());
                Customer extrelandnumber   = dao.exlandnumber(customer.getLand());
                Customer extnic   = dao.listofcustomernic(customer.getNic());
                Customer extcusmobilenumber   = dao.excusmobile(customer.getCpmobile());


                System.out.println("B");
                if (extnic != null){
                    return "Error Validation : Duplicate Nic Address...";
                }else if (extindividualcusemail != null){
                    return "Error Validation : Duplicate Email Address...";
                }else if (extrelandnumber != null){
                    return "Error Validation : Duplicate Land Number...";
                }else if (extcusmobilenumber != null){
                    return "Error Validation : Duplicate Customer Mobile Number...";
                }
            }

            try {
                    dao.save(customer);
                    return "0";

               /* SMS sms = new SMS();
                String sendto = customer.getMobile().substring(1);
                sms.setTo("+94"+sendto);
                sms.setMessage("Added new Product Type");
                serviceSms.send(sms);*/

            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilege...";
    }

    //post mapping for customer object
    @PutMapping
    public String update(@RequestBody Customer customer){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
        try{
            dao.save(customer);
            return "0";
        }catch (Exception ex){
            return "Update not completed "+ex.getMessage();
        }
        } else
            return "error update..! You Have No Privilege...";
    }

    //Delete mapping for custoer object
    @DeleteMapping
    public String delete(@RequestBody Customer customer){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
        try{
            customer.setCustomerstatus_id(daosatus.getById(4));
            dao.save(customer);
            return "0";
        }catch (Exception ex){
            return "Delete not completed "+ex.getMessage();
        }
        } else
            return "error deleting..! You Have No Privilege...";
    }
}