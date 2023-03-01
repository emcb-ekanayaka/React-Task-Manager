package com.printit.controller;

import com.printit.model.Pcoststatus;
import com.printit.repository.ProductcoststatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/pcoststatus")
public class ProductcoststatusController {

    @Autowired // to get a instance
    private ProductcoststatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Pcoststatus> pcoststatusList(){
        return dao.findAll();
    }
}
