package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.*;
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
import java.util.List;

@RestController  //To set the class readable
@RequestMapping(value = "/customerorder")
public class CustomerorderController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private CustomerorderRepository dao;

    @Autowired
    private CustomerRepository daocustomer;

    @Autowired
    private ProductionorderRepository productionorderdao;

    @Autowired
    private ProductionOrderStatusRepository productionorderstatusdao;

    @Autowired
    private CustomerstatusRepository daocustomerstatus;

    @Autowired //To create a Instence for this
    private CorderStatusRepository daosatus;

    @Autowired // to get a instance
    private SMSService serviceSms;

    @Autowired // to get a instance
    private EmailService emailService;

    // Get The Customer Order by Customer in customer payment module
    @GetMapping(value = "/listofordersbyselecteddelivery" ,params = "deliverid", produces = "application/Json")
    public List<Customerorder> listofordersbyselecteddelivery(@RequestParam("deliverid") int deliverid){
        return dao.customerorderbydeliver(deliverid);
    }
    // completed orders and delivery requires order filter
    @GetMapping(value = "/listbyCompletedandRequireDelivery" , produces = "application/Json")
    public List<Customerorder> deliveryrequireandcompletedcustomerList(){
        return dao.listofcustomerorderfordelivery();
    }
    // completed orders and delivery requires order filter
    @GetMapping(value = "/listbyOrdersByselctingdeliver" , produces = "application/Json")
    public List<Customerorder> listofordersbyselectingdeliver(){
        return dao.listofcustomerorderbydeliver();
    }

    // In Add Production Order Module Get All Customer-Ordered Data
    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Customerorder> customerorderList(){
        return dao.list();
    }

    // Get The Customer Order by Customer in customer payment module
    @GetMapping(value = "/listbycustomer" ,params = "customerid", produces = "application/Json")
    public List<Customerorder> customerorderlistbycustomer(@RequestParam("customerid") int customerid){
        return dao.findcustomerorderbycustomer(customerid);
    }

    // Get The Customer Order by Customer in customer payment module
    @GetMapping(value = "/listbycustomerorder" ,params = "customerid", produces = "application/Json")
    public List<Customerorder> customerordertodeliverconfirm(@RequestParam("customerid") int customerid){
        return dao.findcustomerorderbycustomertodeliverconfirm(customerid);
    }

    // this is for in window view
    @GetMapping(value = "/listbycustomertowindow" ,params = "customerid", produces = "application/Json")
    public List<Customerorder> customerorderlistbycustomertowindow(@RequestParam("customerid") int customerid){
        return dao.findcustomerorderbycustomertowindow(customerid);
    }

    //when we  select the customer order , the require date of the customer order will be in production order require date field
    @GetMapping(value = "/bycordercode",params = "cordercode",produces = "application/json")
    public Customerorder customerorder(@RequestParam("cordercode") String cordercodeid){
        return dao.findBycustomerorder(cordercodeid);
    }

    @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Customerorder nextNumber(){
        String nextNumber = dao.getNextNumber();
        Customerorder nextCustomerorder = new Customerorder(nextNumber);
        return nextCustomerorder;
    }

    //Get Request Mapping For Get Supplier page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Customerorder> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMERORDER");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Supplier page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Customerorder> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMERORDER");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }
    //post mapping for insert Quotation object
    @PostMapping
    public String insert(@RequestBody Customerorder corder) {
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERORDER");
        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {
                System.out.println(corder);
                SMS sms = new SMS();
                String sendto = corder.getCustomer_id().getCemail();
                emailService.sendMail("bandaraEkanayaka1998@gmail.com","Hi," +
                        "this is from print it. your order has been placed.","Product Added Successfully");
                Customer newregularcus = daocustomer.getById(corder.getCustomer_id().getId());
                if (newregularcus.getCustomerstatus_id().getName() != "New"){
                    Integer customerordercount = dao.getCountByCustomer(newregularcus.getId());
                    System.out.println(customerordercount);
                    if(customerordercount != null){
                        if (customerordercount >= 1){
                            newregularcus.setCustomerstatus_id(daocustomerstatus.getById(2));
                        }
                    }
                }
                for (CorderHasProduct co : corder.getCorderHasProductList())
                    co.setCorder_id(corder);
                corder.setPaidamount(BigDecimal.valueOf(0.00));
                dao.save(corder);
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }
    //put mapping for insert Supplier object
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
                // if some customer cancel the order ----> production order also should be cancel
                if (corder.getCorderstatus_id().getName().equals("Cancel") ){
                    Productionorder corderProductorder =  productionorderdao.getByCustomerOrder(corder.getId());
                    corderProductorder.setProductionstatus_id(productionorderstatusdao.getById(4));
                    for (ProductionorderHasProduct pohp : corderProductorder.getProductionorderHasProductList())
                        pohp.setProductionorder_id(corderProductorder);
                    for (ProductionorderHasMaterial pohm : corderProductorder.getProductionorderHasMaterialList())
                        pohm.setProductionorder_id(corderProductorder);
                    productionorderdao.save(corderProductorder);
                }
                for (CorderHasProduct chp : corder.getCorderHasProductList())
                    chp.setCorder_id(corder);
                dao.save(corder);
                return "0";
            } catch (Exception ex) {
                return "Update not completed " + ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }
   //Delete mapping for Supplier object
    @DeleteMapping
    public String delete(@RequestBody Customerorder corder){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERORDER");
        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                corder.setCorderstatus_id(daosatus.getById(3));
                for (CorderHasProduct chp : corder.getCorderHasProductList())
                    chp.setCorder_id(corder);
                dao.save(corder);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }
}
