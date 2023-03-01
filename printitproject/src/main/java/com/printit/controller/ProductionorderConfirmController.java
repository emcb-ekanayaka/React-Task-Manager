package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.*;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;

@RestController //To set the class readable
@RequestMapping(value = "/productionorderconfirm")
public class ProductionorderConfirmController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private ProductionorderRepository dao;

    @Autowired //To create a Instence for this
    private ProductionOrderStatusRepository daosatus;

    @Autowired //
    private MaterialInventoryRepository daomaterialinventory;

    @Autowired //
    private MaterialRepository daomaterial;

    @Autowired //
    private MaterialInventoryStatusRepository daomaterialinventorialstatus;

    @Autowired //
    private CustomerorderRepository daocustomerorder;

    @Autowired //
    private CustomerorderstatusRepository daocustomerorderstatus;


   //post mapping for insert Quotation object
    @PostMapping
    public String insert(@RequestBody Productionorder productionorder) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTIONORDERCONFIRM");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {
                productionorder.setProductionstatus_id(daosatus.getById(7));

                Customerorder cuo = daocustomerorder.getById(productionorder.getCorder_id().getId());
                cuo.setCorderstatus_id(daocustomerorderstatus.getById(6));

                for (ProductionorderHasProduct pop : productionorder.getProductionorderHasProductList())
                    pop.setProductionorder_id(productionorder);

                // production order eka confirm karama apita production order View Row ekedi confirm karapu material tika balanna puluwn
                for (ProductionorderHasMaterial pom : productionorder.getProductionorderHasMaterialList())
                    pom.setProductionorder_id(productionorder);

                dao.save(productionorder);

                // low inventory -----> subtraction with the exc inventory quantity
                for (ProductionorderHasMaterial po : productionorder.getProductionorderHasMaterialList()){
                    // get the material object by help of inventory repository
                    Material rsmaterial = daomaterial.getById(po.getMaterial_id().getId());
                    // get the inventory object by help of inventory repository
                    Materialinventory exmaterialinventory = daomaterialinventory.byMaterial(rsmaterial.getId());

                    //subtraction with the exc inventory quantity
                    exmaterialinventory.setAvaqty(exmaterialinventory.getAvaqty().subtract(po.getQty()));

                    //check statement with exciting inventory quantity and ROP of that material <--- this one is on a material modal/table
                    if (BigDecimal.valueOf(rsmaterial.getRop()).compareTo(exmaterialinventory.getAvaqty()) == -1){ //-1 means inside of the compare-to value is greater than outside value

                        exmaterialinventory.setInventorystatus_id(daomaterialinventorialstatus.getById(1));

                    }else{

                        exmaterialinventory.setInventorystatus_id(daomaterialinventorialstatus.getById(2));

                    }
                    daomaterialinventory.save(exmaterialinventory);
                }


                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }


}
