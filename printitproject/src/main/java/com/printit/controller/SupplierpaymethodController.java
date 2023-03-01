package com.printit.controller;

import com.printit.model.Paymethod;
import com.printit.repository.SupplierpaymethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/supplierpaymethod")
public class SupplierpaymethodController {

    @Autowired // to get a instance
    private SupplierpaymethodRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Paymethod> paymethodList(){
        return dao.findAll();
    }
}
