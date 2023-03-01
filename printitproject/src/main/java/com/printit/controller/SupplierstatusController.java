package com.printit.controller;

import com.printit.model.Supplierstatus;
import com.printit.repository.SupplierStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/supplierstatus")
public class SupplierstatusController {

    @Autowired // to get a instance
    private SupplierStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Supplierstatus> materialCategorylist(){
        return dao.findAll();
    }
}
