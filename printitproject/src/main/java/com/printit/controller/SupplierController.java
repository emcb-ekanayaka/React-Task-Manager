package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.SupplierRepository;
import com.printit.repository.SupplierStatusRepository;
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

@RestController  //To set the class readable
@RequestMapping(value = "/supplier")
public class SupplierController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private SupplierRepository dao;

    @Autowired //To create a Instence for this
    private SupplierStatusRepository daosatus;

    //service in controller for duplicated Land Number
    @GetMapping(value = "/byland",params = "landnumber",produces = "application/json")
    public Supplier supplierbylandnumber(@RequestParam("landnumber") String landnumber){
        return dao.findBylandnumber(landnumber);
    }

    //service in controller for duplicated email address
    @GetMapping(value = "/byemail",params = "email",produces = "application/json")
    public Supplier supplierbyemail(@RequestParam("email") String email){
        return dao.findByemail(email);
    }

    //Get Request For QR Supplier list
    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Supplier> supplierList(){
        return dao.list();
    }

    @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Supplier nextNumber(){
        String nextNumber = dao.getNextNumber();
        Supplier nextSupplier = new Supplier(nextNumber);
        return nextSupplier;
    }

    //Get Request Mapping For Get Supplier page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Supplier> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIER");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Supplier page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Supplier> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIER");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //post mapping for insert Quotation object
    @PostMapping
    public String insert(@RequestBody Supplier supplier) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {

                for (SupplierHasMaterial shi : supplier.getSupplierHasMaterials())
                    shi.setSupplier_id(supplier);

                dao.save(supplier);
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

    //put mapping for insert Supplier object
    @PutMapping
    public String update(@RequestBody Supplier supplier) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try {

                System.out.println(supplier);
                for (SupplierHasMaterial shi : supplier.getSupplierHasMaterials())
                    shi.setSupplier_id(supplier);

                dao.save(supplier);
                return "0";
            } catch (Exception ex) {
                return "Update not completed " + ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

    //Delete mapping for Supplier object
    @DeleteMapping
    public String delete(@RequestBody Supplier supplier){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                supplier.setSupplierstatus_id(daosatus.getById(3));

                for (SupplierHasMaterial shi : supplier.getSupplierHasMaterials())
                    shi.setSupplier_id(supplier);

                dao.save(supplier);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }
}
