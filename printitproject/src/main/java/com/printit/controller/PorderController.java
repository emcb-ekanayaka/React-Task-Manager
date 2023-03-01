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
@RequestMapping(value = "/porder")
public class PorderController {

    @Autowired //To create a Instence for this
    private PorderRepository dao;

    @Autowired // to get a instance
    private UserService userService;

    @Autowired // to get a instance
    private PrevilageController previlageController;

  @Autowired //To create a Instence for this
    private PurchaseorderStatusRepository daosatus;

    @Autowired //To create a Instence for this
    private QuotationRepository daoquotation;

    @Autowired //To create a Instence for this
    private QuotationStatusRepository daoqstatus;

  //get porder list by selecting supplier
    @GetMapping(value = "/listbyporder" ,params = {"supplierid"}, produces = "application/Json")
    public List<Purchaseorder>purchaseorderList(@RequestParam("supplierid") Integer supplierid ){
        return dao.purchaseorderlist(supplierid);
    }

    //Auto porder code
    @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Purchaseorder nextNumber(){
        String nextNumber = dao.getNextNumber();
        Purchaseorder nextPurchaseorder= new Purchaseorder(nextNumber);
        return nextPurchaseorder;
    }

    //Get Request For Grn purchase order list
    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Purchaseorder> porderList(){
        return dao.list();
    }

    //Get Request Mapping For Get Material page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Purchaseorder> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PURCHASEORDER");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Material page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Purchaseorder> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PURCHASEORDER");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }



    @PostMapping //post mapping for insert material object
    public String insert(@RequestBody Purchaseorder purchaseorder) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PURCHASEORDER");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {
                for (PorderHasMaterial req : purchaseorder.getPorderHasMaterialList())
                    req.setPorder_id(purchaseorder);

                Quotation qt = daoquotation.getById(purchaseorder.getQuotation_id().getId());
                qt.setQuotationstatus_id(daoqstatus.getById(2));

                for (QuotationHasMaterial qm : qt.getQuotationHasMaterialList())
                    qm.setQuotation_id(qt);

                daoquotation.save(qt);
                dao.save(purchaseorder);

                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }


    //post mapping for Material object
    @PutMapping
    public String update(@RequestBody Purchaseorder purchaseorder){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PURCHASEORDER");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try{

                for (PorderHasMaterial req : purchaseorder.getPorderHasMaterialList())
                    req.setPorder_id(purchaseorder);

                dao.save(purchaseorder);
                return "0";
            }catch (Exception ex){
                return "Update not completed "+ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }


    //Delete mapping for Material object
    @DeleteMapping
    public String delete(@RequestBody Purchaseorder purchaseorder){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PURCHASEORDER");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                purchaseorder.setPorderstatus_id(daosatus.getById(3));
                for (PorderHasMaterial req : purchaseorder.getPorderHasMaterialList())
                    req.setPorder_id(purchaseorder);

                dao.save(purchaseorder);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }

}
