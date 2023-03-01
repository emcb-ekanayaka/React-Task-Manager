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

import java.util.Date;
import java.util.HashMap;
import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/delivery")
public class DeliveryController {

    @Autowired //To create a Instence for this
    private DeliveryRepository dao;

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private CustomerorderRepository daocutomerorderrepo;

    @Autowired
    private CustomerorderstatusRepository daocutomerorderstatusrepo;

    @Autowired
    private CorderhasproductRepository daocutomerorderhasproduct;

    @Autowired //
    private CorderhasproductRepository daocorderhasproduct;

   @Autowired //To create a Instence for this
    private DeliveryStatusRepository daosatus;

    //
    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Delivery> deliveryList(){
        return dao.findAll();
    }

   // /delivery/listofagentandvehical?deliverydateid
    @GetMapping(value = "/listofagentandvehical" ,params = {"deliverydateid"}, produces = "application/Json")
    public Delivery deliveryagentandvehical(@RequestParam("deliverydateid") Date deliverydateid){
        return dao.deliveryagentvehical(deliverydateid);
    }

    @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Delivery nextNumber(){
        String nextNumber = dao.getNextNumber();
        Delivery nextDelivery = new Delivery(nextNumber);
        return nextDelivery;
    }

    //Get Request Mapping For Get Material page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Delivery> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"DELIVERY");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Material page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Delivery> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"DELIVERY");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }


   //post mapping for insert material object
    @PostMapping
    public String insert(@RequestBody Delivery delivery) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "DELIVERY");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {
                // Read the inner table to get the customer order
                for (DeliveryHasCorder dhcorder : delivery.getDeliveryHasCorderList()){
                    Customerorder cus = daocutomerorderrepo.getById(dhcorder.getCorder_id().getId());
                    cus.setCorderstatus_id(daocutomerorderstatusrepo.getById(8));
                    CorderHasProduct chp = daocutomerorderhasproduct.getById(dhcorder.getCorder_id().getId());
                    chp.setCorderstatus_id(daocutomerorderstatusrepo.getById(8));

                    for (CorderHasProduct cop : cus.getCorderHasProductList())
                        cop.setCorder_id(cus);

                    daocutomerorderhasproduct.save(chp);
                    daocutomerorderrepo.save(cus);
            }
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

   //post mapping for Material object
    @PutMapping
    public String update(@RequestBody Delivery delivery){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "DELIVERY");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try{

                for (DeliveryHasCorder dhc : delivery.getDeliveryHasCorderList())
                    dhc.setDelivery_id(delivery);

                dao.save(delivery);
                return "0";
            }catch (Exception ex){
                return "Update not completed "+ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

    //Delete mapping for Material object
     @DeleteMapping
    public String delete(@RequestBody Delivery delivery){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "DELIVERY");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{

                for (DeliveryHasCorder dhc : delivery.getDeliveryHasCorderList())
                    dhc.setDelivery_id(delivery);

                delivery.setDeliverystatus_id(daosatus.getById(3));
                dao.save(delivery);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }/* */

}
