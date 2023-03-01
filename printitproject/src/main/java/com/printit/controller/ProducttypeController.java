package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.ProducttypeRepository;
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

import java.util.HashMap;
import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/producttype")
public class ProducttypeController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired // to get a instance
    private PrevilageController previlageController;

    @Autowired // to get a instance
    private ProducttypeRepository dao;

    @Autowired // to get a instance
    private SMSService serviceSms;

    @Autowired // to get a instance
    private EmailService emailService;

    @GetMapping(value = "/webviewlist", produces = "application/json")
    public List<Producttype> webViewList(){
        return dao.webviewlist();
    }


    @GetMapping(value = "/list", produces = "application/json")
    public List<Producttype> producttypeList(){
        return dao.findAll() ;
    }

    @GetMapping(value = "/webproducttypelist", produces = "application/json")
    public List<Producttype> webproducttypelist(){
        return dao.webproducttypelist() ;
    }

    @GetMapping(value = "/listbydesigntype" , params = {"designtype"}, produces = "application/json")
    public List<Producttype>producttypeList(@RequestParam("designtype") int designtype){
        return dao.listByDesigntype(designtype);
    }

    //Get Request Mapping For Get Customer page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Producttype> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PRODUCTTYPE");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Customer page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Producttype> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PRODUCTTYPE");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //post mapping for insert custoer object
    @PostMapping
    public String insert(@RequestBody Producttype producttype) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTTYPE");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {
                dao.save(producttype);
           /*     SMS sms = new SMS();
                sms.setTo("+94768601324");
                sms.setMessage("Added new Product Type");
                serviceSms.send(sms);*/
                emailService.sendMail("bandaraEkanayaka1998@gmail.com","New Product Added","Product Added Successfully");

                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

    //post mapping for customer object
    @PutMapping
    public String update(@RequestBody Producttype producttype){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTTYPE");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try{
                dao.save(producttype);
                return "0";
            }catch (Exception ex){
                return "Update not completed "+ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

    //Delete mapping for custoer object
    @DeleteMapping
    public String delete(@RequestBody Producttype producttype){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTTYPE");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                dao.delete(producttype);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }
}
