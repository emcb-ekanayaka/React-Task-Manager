package com.printit.controller;


import com.printit.model.ProductionorderHasProduct;
import com.printit.repository.ProductionorderHasProductlRepository;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController //To set the class readable
@RequestMapping(value = "/productionorderhasproduct")
public class ProductionorderHasProductController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private ProductionorderHasProductlRepository dao;

    // get ordered qty of provided product id in daily production UI
    @GetMapping(value = "/objectbyproduct" ,params = {"productionorderid", "productid"}, produces = "application/Json")
    public ProductionorderHasProduct productionorderHasProductList(@RequestParam("productionorderid") int productionorderid, @RequestParam("productid") int productid){
        return dao.qtybyproduct(productionorderid,productid);
    }

}
