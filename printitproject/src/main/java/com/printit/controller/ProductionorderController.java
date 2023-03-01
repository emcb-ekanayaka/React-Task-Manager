package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.*;
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
@RequestMapping(value = "/productionorder")
public class ProductionorderController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private ProductionorderRepository dao;

    @Autowired
    private CustomerorderstatusRepository daocstatus;

    @Autowired
    private CustomerorderRepository daocustomer;

    @Autowired //To create a Instence for this
    private ProductionOrderStatusRepository daosatus;

    //view window customer product details
    @GetMapping(value = "/productiondetails" ,params = "newcustomerorderid", produces = "application/Json")
    public Productionorder productiondetails(@RequestParam("newcustomerorderid") Integer newcustomerorderid){
         return dao.getByCustomerOrder(newcustomerorderid);
    }

    //Get Request For Product list
    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Productionorder> productionorderList(){
        return dao.list();
    }

    //Get Request For Product list
    @GetMapping(value = "/listproductionbystatus" , produces = "application/Json")
    public List<Productionorder> productionorderlisttodailyproduct(){
        return dao.listbystatus();
    }

  @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Productionorder nextNumber(){
        String nextNumber = dao.getNextNumber();
        Productionorder nextproductionorder = new Productionorder(nextNumber);
        return nextproductionorder;
    }

    //Get Request Mapping For Get Supplier page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Productionorder> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PRODUCTIONORDER");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Supplier page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Productionorder> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PRODUCTIONORDER");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

   //post mapping for insert Quotation object
    @PostMapping
    public String insert(@RequestBody Productionorder productionorder) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTIONORDER");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {
                Customerorder cus = daocustomer.getById(productionorder.getCorder_id().getId());
                cus.setCorderstatus_id(daocstatus.getById(2));

                for (CorderHasProduct cop : cus.getCorderHasProductList())
                    cop.setCorder_id(cus);

                for (ProductionorderHasProduct pop : productionorder.getProductionorderHasProductList())
                    pop.setProductionorder_id(productionorder);


                for (ProductionorderHasMaterial pom : productionorder.getProductionorderHasMaterialList())
                    pom.setProductionorder_id(productionorder);


                daocustomer.save(cus);
                dao.save(productionorder);
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

    //put mapping for insert Supplier object
    @PutMapping
    public String update(@RequestBody Productionorder productionorder) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTIONORDER");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try {

                for (ProductionorderHasProduct pop : productionorder.getProductionorderHasProductList())
                    pop.setProductionorder_id(productionorder);
                for (ProductionorderHasMaterial pom : productionorder.getProductionorderHasMaterialList())
                    pom.setProductionorder_id(productionorder);

                dao.save(productionorder);
                return "0";
            } catch (Exception ex) {
                return "Update not completed " + ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

   //Delete mapping for Supplier object
    @DeleteMapping
    public String delete(@RequestBody Productionorder productionorder){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTIONORDER");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                productionorder.setProductionstatus_id(daosatus.getById(3));

                for (ProductionorderHasProduct pop : productionorder.getProductionorderHasProductList())
                    pop.setProductionorder_id(productionorder);
                for (ProductionorderHasMaterial pom : productionorder.getProductionorderHasMaterialList())
                    pom.setProductionorder_id(productionorder);

                dao.save(productionorder);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }
}
