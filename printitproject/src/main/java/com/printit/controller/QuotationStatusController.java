package com.printit.controller;

import com.printit.model.Quotationstatus;
import com.printit.repository.QuotationStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/quotationstatus")
public class QuotationStatusController {

    @Autowired // to get a instance
    private QuotationStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Quotationstatus> qstatusList(){
        return dao.findAll();
    }
}
