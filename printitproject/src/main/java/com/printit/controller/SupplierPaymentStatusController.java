package com.printit.controller;

import com.printit.model.Supplierpaystatus;
import com.printit.repository.SupplierpaymentStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/supplierpaystatus")
public class SupplierPaymentStatusController {

    @Autowired // to get a instance
    private SupplierpaymentStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Supplierpaystatus> supplierpaystatusList(){
        return dao.findAll();
    }
}
