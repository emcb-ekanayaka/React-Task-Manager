package com.printit.controller;

import com.printit.model.Productionstatus;
import com.printit.repository.ProductionOrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/productionorderstatus")
public class ProductionorderStatusController {

    @Autowired // to get a instance
    private ProductionOrderStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Productionstatus> productionstatusList(){
        return dao.findAll();
    }
}
