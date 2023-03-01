package com.printit.controller;

import com.printit.model.QuotationRequestHasMaterial;
import com.printit.model.Quotationrequest;
import com.printit.model.User;
import com.printit.repository.QuotationRequestRepository;
import com.printit.repository.QuotationRequestStatusRepository;
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
@RequestMapping(value = "/quotationrequest")
public class QuotationrequestController {

    @Autowired //To create a Instence for this
    private QuotationRequestRepository dao;

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired //To create a Instence for this
    private QuotationRequestStatusRepository daosatus;

    //get quotationrequest list by selecting supplier
    @GetMapping(value = "/listbyquotationrequest" , params = {"supplierid"},produces = "application/Json")
    public List<Quotationrequest> supplierListQuotationrequests(@RequestParam("supplierid") int supplierid){
        return dao.ListBySupplier(supplierid);
    }

    //get quotation request list by quotation
    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Quotationrequest> supplierList(){
        return dao.list();
    }

   // get next number
    @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Quotationrequest nextNumber(){
        String nextQuotationRequest = dao.getNextNumber();
        Quotationrequest nextQuotation = new Quotationrequest(nextQuotationRequest);
        return nextQuotation;
    }

    //Get Request Mapping For Get Material page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Quotationrequest> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATIONREQUEST");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }


    //Get Request Mapping For Get Material page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Quotationrequest> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATIONREQUEST");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }


    //post mapping for insert material object
    @PostMapping
    public String insert(@RequestBody Quotationrequest quotationrequest) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATIONREQUEST");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {

                for (QuotationRequestHasMaterial req : quotationrequest.getQuotationRequestHasMaterialList())
                    req.setQuotationrequest_id(quotationrequest);

                dao.save(quotationrequest);
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

    //post mapping for Material object
    @PutMapping
    public String update(@RequestBody Quotationrequest quotationrequest){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATIONREQUEST");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try{

                for (QuotationRequestHasMaterial req : quotationrequest.getQuotationRequestHasMaterialList())
                    req.setQuotationrequest_id(quotationrequest);

                dao.save(quotationrequest);
                return "0";
            }catch (Exception ex){
                return "Update not completed "+ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

  //Delete mapping for Material object
    @DeleteMapping
    public String delete(@RequestBody Quotationrequest quotationrequest){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATIONREQUEST");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                quotationrequest.setQrstatus_id(daosatus.getById(3));

                for (QuotationRequestHasMaterial req : quotationrequest.getQuotationRequestHasMaterialList())
                    req.setQuotationrequest_id(quotationrequest);
                dao.save(quotationrequest);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }


}
