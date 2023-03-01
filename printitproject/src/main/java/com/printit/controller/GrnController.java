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

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

@RestController //To set the class readable
@RequestMapping (value = "/grn")  //set the mapping for this class
public class GrnController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired // to get a instance
    private PrevilageController previlageController;

    @Autowired //To create a Instence for this
    private GrnRepository dao;

    @Autowired //To create a Instence for this
    private GrnStatusRepository daosatus;

    @Autowired //
    private MaterialInventoryRepository daomaterialinventory;

    @Autowired //
    private MaterialRepository daomaterial;

    @Autowired //get inventory status to set inventory status
    private MaterialInventoryStatusRepository daomaterialinventorialstatus;

    //service in controller
    @GetMapping(value = "/listbysupplier",params = "supplierid",produces = "application/json")
    public List<Grn> grnBysupplier(@RequestParam("supplierid") Integer supplierid){
        return dao.grnList(supplierid);
    }

    //Get Request For supplier payment by Supplier list
    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Grn> grnList(){
        return dao.list();
    }

    //Get Next Number
    @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Grn nextNumber(){
        String nextNumber = dao.getNextNumber();
        Grn nextCustomer = new Grn(nextNumber);
        return nextCustomer;
    }


    //Get Request Mapping For Get Grn page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Grn> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"GRN");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Grn page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Grn> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"GRN");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
        return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    @Transactional // role back
    //post mapping for insert customer object
    @PostMapping
    public String insert(@RequestBody Grn grn) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {
                for (GrnHasMaterial gr : grn.getGrnHasMaterialList())
                    gr.setGrn_id(grn);
                dao.save(grn);

                // read the grn-has-material object one by one
                for (GrnHasMaterial gr : grn.getGrnHasMaterialList()){
                    // get the material object
                    Material rsmaterial = daomaterial.getById(gr.getMaterial_id().getId()); // GrnHasMaterial ---> material id meka wecha material table object eka gannwa
                    // get the inventory object by help of inventory repository
                    Materialinventory exmaterialinventory = daomaterialinventory.byMaterial(rsmaterial.getId());// received material ekata adala inventory object(row) eka store karanwa exmaterialinventory
                    // check is there any equal inventory
                    if (exmaterialinventory != null){
                        // add to inventory available quantity to the grn quantity
                        exmaterialinventory.setAvaqty(exmaterialinventory.getAvaqty().add(gr.getQty()));
                        // add to inventory total quantity to the grn quantity
                        exmaterialinventory.setTotalqty(exmaterialinventory.getTotalqty().add(gr.getQty()));

                        // if rop mentioned
                        if (rsmaterial.getRop() != null){
                            //check statement with exciting inventory quantity and ROP of that material <--- this one is on a material modal/table
                            if (BigDecimal.valueOf(rsmaterial.getRop()).compareTo(exmaterialinventory.getAvaqty()) >= -1){ //-1 means inside of the compare-to value is greater than outside value
                                exmaterialinventory.setInventorystatus_id(daomaterialinventorialstatus.getById(1));
                                // 1 - Available      2 - Low inventory
                            }else {
                                exmaterialinventory.setInventorystatus_id(daomaterialinventorialstatus.getById(2));
                            }
                        }else {
                            // if rop not-mentioned
                            exmaterialinventory.setInventorystatus_id(daomaterialinventorialstatus.getById(1));
                        }

                        daomaterialinventory.save(exmaterialinventory);

                        // if there aren't any inventory else part will run
                    }else {
                        // create a new material inventory object by using material inventory model
                        Materialinventory newmaterial = new Materialinventory();
                        // set the material to inventory table
                        newmaterial.setMaterial_id(rsmaterial);
                        // set the material available quantity to inventory table
                        newmaterial.setAvaqty(gr.getQty());
                        // set the material total quantity to inventory table
                        newmaterial.setTotalqty(gr.getQty());
                        // set status to the material inventory
                        if (BigDecimal.valueOf(rsmaterial.getRop()).compareTo(newmaterial.getAvaqty()) >= -1){
                            newmaterial.setInventorystatus_id(daomaterialinventorialstatus.getById(1));
                        }else {
                            newmaterial.setInventorystatus_id(daomaterialinventorialstatus.getById(2));
                        }

                        daomaterialinventory.save(newmaterial);
                    }
                }

                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

    //post mapping for customer object
    @PutMapping
    public String update(@RequestBody Grn grn){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
        try{
            for (GrnHasMaterial gr : grn.getGrnHasMaterialList())
            gr.setGrn_id(grn);
            dao.save(grn);

            // read the grn has material object one by one
            for (GrnHasMaterial gr : grn.getGrnHasMaterialList()){
                // get the material object
                Material rsmaterial = daomaterial.getById(gr.getMaterial_id().getId()); // GrnHasMaterial ---> material id meka wecha material table object eka gannwa
                // get the inventory object by help of inventory repository
                Materialinventory exmaterialinventory = daomaterialinventory.byMaterial(rsmaterial.getId());// received material ekata adala inventory object(row) eka store karanwa exmaterialinventory
                // check is there any equal inventory
                if (exmaterialinventory != null){
                    // add to inventory available quantity to the grn quantity
                    exmaterialinventory.setAvaqty(exmaterialinventory.getAvaqty().add(gr.getQty()));
                    // add to inventory total quantity to the grn quantity
                    exmaterialinventory.setTotalqty(exmaterialinventory.getTotalqty().add(gr.getQty()));

                    // if rop mentioned
                    if (rsmaterial.getRop() != null){
                        //check statement with exciting inventory quantity and ROP of that material <--- this one is on a material modal/table
                        if (BigDecimal.valueOf(rsmaterial.getRop()).compareTo(exmaterialinventory.getAvaqty()) >= -1){ //-1 means inside of the compare-to value is greater than outside value
                            exmaterialinventory.setInventorystatus_id(daomaterialinventorialstatus.getById(1));
                        }else {
                            exmaterialinventory.setInventorystatus_id(daomaterialinventorialstatus.getById(2));
                        }
                    }else {
                        // if rop not-mentioned
                        exmaterialinventory.setInventorystatus_id(daomaterialinventorialstatus.getById(1));
                    }

                    daomaterialinventory.save(exmaterialinventory);

                    // if there aren't any inventory else part will run
                }else {
                    // create a new material inventory object by using material inventory model
                    Materialinventory newmaterial = new Materialinventory();
                    // set the material to inventory table
                    newmaterial.setMaterial_id(rsmaterial);
                    // set the material available quantity to inventory table
                    newmaterial.setAvaqty(gr.getQty());
                    // set the material total quantity to inventory table
                    newmaterial.setTotalqty(gr.getQty());
                    // set status to the material inventory
                    if (BigDecimal.valueOf(rsmaterial.getRop()).compareTo(newmaterial.getAvaqty()) >= -1){
                        newmaterial.setInventorystatus_id(daomaterialinventorialstatus.getById(1));
                    }else {
                        newmaterial.setInventorystatus_id(daomaterialinventorialstatus.getById(2));
                    }

                    daomaterialinventory.save(newmaterial);
                }
            }

            return "0";
        }catch (Exception ex){
            return "Update not completed "+ex.getMessage();
        }
        } else
            return "error update..! You Have No Privilage...";
    }

   //Delete mapping for custoer object
    @DeleteMapping
    public String delete(@RequestBody Grn grn){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
        try{
            grn.setGrnstatus_id(daosatus.getById(3));
            for (GrnHasMaterial gr : grn.getGrnHasMaterialList())
                gr.setGrn_id(grn);
            dao.save(grn);
            return "0";
        }catch (Exception ex){
            return "Delete not completed "+ex.getMessage();
        }
        } else
            return "error deleting..! You Have No Privilage...";
    }
}