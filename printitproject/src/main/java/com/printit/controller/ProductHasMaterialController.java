package com.printit.controller;


import com.printit.model.ProductHasMaterial;
import com.printit.repository.ProductHasMaterialRepository;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/producthasmaterial")
public class ProductHasMaterialController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private ProductHasMaterialRepository dao;

    //Get Request For Production cost list by product type  {/producthasmaterial/listbyproduct?productid=1}
    @GetMapping(value = "/listbyproduct" ,params = {"productid"}, produces = "application/Json")
    public List<ProductHasMaterial> productHasMatriallistbyproduct(@RequestParam("productid") int productid){
        return dao.listbyproduct(productid);
    }

}
