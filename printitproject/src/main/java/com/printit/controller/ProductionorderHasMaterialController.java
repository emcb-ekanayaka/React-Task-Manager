package com.printit.controller;


import com.printit.model.ProductionorderHasMaterial;
import com.printit.repository.ProductionorderHasMaterialRepository;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController //To set the class readable
@RequestMapping(value = "/productionorderhasmaterial")
public class ProductionorderHasMaterialController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private ProductionorderHasMaterialRepository dao;

    //Get Request For Production cost list by product type  {/producthasmaterial/listbyproduct?productid=1}
    @GetMapping(value = "/byproductionordermaterial" ,params = {"productionorderid"}, produces = "application/Json")
    public ProductionorderHasMaterial productHasMatriallistbyproduct(@RequestParam("productionorderid") int productionorderid){
        return dao.productionorderhasmaterial(productionorderid);
    }

}
