package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.CustomerrequestRepository;
import com.printit.repository.CustomerrequestStatusRepository;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController  //To set the class readable
@RequestMapping(value = "/customerrequest")
public class CustomerrequestController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private CustomerrequestRepository dao;

   @Autowired //To create a Instence for this
    private CustomerrequestStatusRepository daosatus;

   //Get Request Mapping For Get Supplier page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Customerrequest> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMERREQUEST");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Supplier page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Customerrequest> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMERREQUEST");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //post mapping for insert Quotation object
    @PostMapping
    public String insert(@RequestBody Customerrequest cusrequest) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMEREQUEST");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {

                cusrequest.setCusrequeststatus_id(daosatus.getById(1));
                for (CustomerrequestHasProduct cr : cusrequest.getCustomerrequestHasProductList())
                    cr.setCustomerrequest_id(cusrequest);


                dao.save(cusrequest);
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

/*    //put mapping for insert Supplier object
    @PutMapping
    public String update(@RequestBody Customerorder corder) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERORDER");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try {

                for (CorderHasProduct chp : corder.getCorderHasProductList())
                    chp.setCorder_id(corder);

                dao.save(corder);
                return "0";
            } catch (Exception ex) {
                return "Update not completed " + ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }*/

   //Delete mapping for Supplier object
    @DeleteMapping
    public String delete(@RequestBody Customerrequest cusrequest){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMEREQUEST");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{

                dao.delete(cusrequest);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }
}
