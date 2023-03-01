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
@RequestMapping(value = "/daliyproduct")
public class DailyProductController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private DailyProductRepository dao;

    @Autowired
    private CustomerorderRepository daocustomerorder;

    @Autowired
    private CustomerorderstatusRepository daocustomerorderstatus;

    @Autowired
    private ProductionorderRepository daoprodution;

    @Autowired
    private ProductionOrderStatusRepository daoprodutionstatus;

    @Autowired
    private ProductionorderHasProductlRepository daoprorderhasproduct;

    @Autowired
    private CorderhasproductRepository daocorderhasproduct;

    //localhost:8080/daliyproduct/byproduct?productionorderid=6&productid=5
    @GetMapping(value = "/byproduct" ,params ={"productionorderid", "productid"}, produces = "application/Json") //values type will return as a json object.
    public Dailyproduct byProductionorderProduct(@RequestParam("productionorderid") int productionorderid , @RequestParam("productid") int productid){
        List<Dailyproduct> dailyproductList = dao.qtyofselectedproduct(productionorderid, productid);
        //
        if (dailyproductList.size() != 0){
            // get the latest completed quantity of the daily production
            return dailyproductList.get(0);
        }else {
            return null;
        }
    }

    //Get Request Mapping For Get Supplier page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Dailyproduct> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"DAILYPRODUCT");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Supplier page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Dailyproduct> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"DAILYPRODUCT");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

  //post mapping for insert Quotation object
    @PostMapping
    public String insert(@RequestBody Dailyproduct dailyproduction) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "DAILYPRODUCT");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {

                dao.save(dailyproduction);
                // change production order status to On-Going
                Productionorder po = daoprodution.getById(dailyproduction.getProductionorder_id().getId());
                po.setProductionstatus_id(daoprodutionstatus.getById(6));

                // get production_order_has_product object by using production order & product parameters of this function that creaed in repo qtybyproduct
                ProductionorderHasProduct pohp = daoprorderhasproduct.qtybyproduct(dailyproduction.getProductionorder_id().getId(),dailyproduction.getProduct_id().getId());
                pohp.setCompletedqty(dailyproduction.getTotalcomqty());

                // compare two quantities of production order product module
                if (pohp.getQty() <= pohp.getCompletedqty()){
                    //if product order quantity is less than completed quantity status is completed
                    pohp.setProductionstatus_id(daoprodutionstatus.getById(1));
                }else {
                    //if product order quantity is grater than completed quantity status On-Going
                    pohp.setProductionstatus_id(daoprodutionstatus.getById(6));
                }
                boolean checkproductionhasproductstatus = false; // set checkstatus to false and read the Inner Table One By one of Production Order Product
                for (ProductionorderHasProduct readpohplist :po.getProductionorderHasProductList()){
                    //1 -completed , 6 -On-Going , 4 -Pending
                    if (readpohplist.getProductionstatus_id().equals(daoprodutionstatus.getById(6)) || readpohplist.getProductionstatus_id().equals(daoprodutionstatus.getById(4))){
                        checkproductionhasproductstatus = true;
                    }
                        //
                        if (checkproductionhasproductstatus){
                            po.setProductionstatus_id(daoprodutionstatus.getById(6));
                        }else {
                            po.setProductionstatus_id(daoprodutionstatus.getById(1));
                        }

                }
                for (ProductionorderHasProduct pohproduct : po.getProductionorderHasProductList())
                    pohproduct.setProductionorder_id(po);

                for (ProductionorderHasMaterial pohm : po.getProductionorderHasMaterialList())
                    pohm.setProductionorder_id(po);

                //change customer-order status to In-Production
                Customerorder co = daocustomerorder.getById(po.getCorder_id().getId());
                co.setCorderstatus_id(daocustomerorderstatus.getById(2));

                // get customer order has product Inner Table by given product and C-order
                CorderHasProduct cohp = daocorderhasproduct.qtybycustomerproduct(dailyproduction.getProduct_id().getId(),dailyproduction.getProductionorder_id().getCorder_id().getId());
                cohp.setCompletedqty(dailyproduction.getTotalcomqty()); //set total quantity to customer order has product Inner table

                // set Product Status Individual In customer Order Inner Table
                if (cohp.getQty() <= cohp.getCompletedqty()){
                    // 2-In production , 4-Completed
                    cohp.setCorderstatus_id(daocustomerorderstatus.getById(4));
                }else {
                    cohp.setCorderstatus_id(daocustomerorderstatus.getById(2));
                }

                boolean checkcustomerproductstatus = false; // set checkstatus to false and read the Inner Table One By one of Production Order Product
                for (CorderHasProduct readcohplist :co.getCorderHasProductList()){
                    // 2 -In-Production ,4 -Completed, 1 -Ordered
                    if (readcohplist.getCorderstatus_id().equals(daocustomerorderstatus.getById(1)) || readcohplist.getCorderstatus_id().equals(daocustomerorderstatus.getById(2))){
                        checkcustomerproductstatus = true;
                    }
                        //
                        if (checkcustomerproductstatus){

                            co.setCorderstatus_id(daocustomerorderstatus.getById(2));
                        }else {

                            co.setCorderstatus_id(daocustomerorderstatus.getById(4));
                        }

                }

                for (CorderHasProduct cop : co.getCorderHasProductList())
                    cop.setCorder_id(co);

                daocustomerorder.save(co);
                daoprodution.save(po);


                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

   //put mapping for insert Supplier object
    @PutMapping
    public String update(@RequestBody Dailyproduct dailyproduction) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "DAILYPRODUCT");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try {
                dao.save(dailyproduction);
                return "0";
            } catch (Exception ex) {
                return "Update not completed " + ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

     //Delete mapping for Supplier object
    @DeleteMapping
    public String delete(@RequestBody Dailyproduct dailyproduction){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "DAILYPRODUCT");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                //dao.delete(dailyproduction);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }
}
