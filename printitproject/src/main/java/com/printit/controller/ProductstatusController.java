package com.printit.controller;

import com.printit.model.Productstatus;
import com.printit.repository.ProductStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/productstatus")
public class ProductstatusController {

    @Autowired // to get a instance
    private ProductStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Productstatus> productstatusList(){
        return dao.findAll();
    }
}
